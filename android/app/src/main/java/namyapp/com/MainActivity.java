package namyapp.com;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends BridgeActivity {

    private static final String TAG = "DnsFallback";
    private static final String BACKEND_HOST = "namy-backend.onrender.com";
    private static final String FALLBACK_DNS_SERVER = "8.8.8.8";
    private static final int DNS_PORT = 53;
    private static final int DNS_TIMEOUT_MS = 3000;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Do NOT let Android automatically fit system windows — we handle it manually.
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);

        // Apply bottom inset (nav bar) as padding on the root view so the
        // WebView content never goes behind the 3-button or gesture nav bar.
        View rootView = findViewById(android.R.id.content);
        ViewCompat.setOnApplyWindowInsetsListener(rootView, (view, insets) -> {
            int bottomInset = insets.getInsets(WindowInsetsCompat.Type.navigationBars()).bottom;
            view.setPadding(0, 0, 0, bottomInset);
            return WindowInsetsCompat.CONSUMED;
        });

        // Pre-resolve backend hostname on startup to populate JVM DNS cache.
        // If the device's DNS server returns SERVFAIL, falls back to querying 8.8.8.8 directly.
        new Thread(this::preResolveDns).start();
    }

    private void preResolveDns() {
        try {
            InetAddress[] addrs = InetAddress.getAllByName(BACKEND_HOST);
            Log.i(TAG, "System DNS OK: " + BACKEND_HOST + " → " + addrs[0].getHostAddress());
        } catch (UnknownHostException e) {
            Log.w(TAG, "System DNS failed for " + BACKEND_HOST + " — trying fallback " + FALLBACK_DNS_SERVER);
            try {
                List<InetAddress> addrs = queryDnsServer(BACKEND_HOST, FALLBACK_DNS_SERVER);
                if (addrs.isEmpty()) {
                    Log.e(TAG, "Fallback DNS returned no A records for " + BACKEND_HOST);
                    return;
                }
                Log.i(TAG, "Fallback DNS resolved " + BACKEND_HOST + " → " + addrs.get(0).getHostAddress());
                seedInetAddressCache(BACKEND_HOST, addrs.toArray(new InetAddress[0]));
            } catch (Exception ex) {
                Log.e(TAG, "Fallback DNS query failed: " + ex.getMessage());
            }
        }
    }

    // -------------------------------------------------------------------------
    // Minimal UDP DNS client — queries a specific DNS server for A records
    // -------------------------------------------------------------------------

    private List<InetAddress> queryDnsServer(String hostname, String dnsServer) throws IOException {
        byte[] query = buildDnsQuery(hostname);
        DatagramSocket socket = new DatagramSocket();
        socket.setSoTimeout(DNS_TIMEOUT_MS);
        try {
            // Use InetAddress.getByName with a literal IP — no DNS lookup required
            InetAddress server = InetAddress.getByName(dnsServer);
            socket.send(new DatagramPacket(query, query.length, server, DNS_PORT));
            byte[] buf = new byte[1024];
            DatagramPacket response = new DatagramPacket(buf, buf.length);
            socket.receive(response);
            return parseDnsARecords(buf, response.getLength());
        } finally {
            socket.close();
        }
    }

    private byte[] buildDnsQuery(String hostname) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        DataOutputStream dos = new DataOutputStream(baos);
        dos.writeShort(0x1234); // Transaction ID
        dos.writeShort(0x0100); // Flags: standard query, recursion desired
        dos.writeShort(1);      // QDCOUNT: 1 question
        dos.writeShort(0);      // ANCOUNT
        dos.writeShort(0);      // NSCOUNT
        dos.writeShort(0);      // ARCOUNT
        for (String label : hostname.split("\\.")) {
            dos.writeByte(label.length());
            dos.write(label.getBytes("UTF-8"));
        }
        dos.writeByte(0);  // Root label
        dos.writeShort(1); // QTYPE: A
        dos.writeShort(1); // QCLASS: IN
        return baos.toByteArray();
    }

    private List<InetAddress> parseDnsARecords(byte[] buf, int len) throws IOException {
        List<InetAddress> addresses = new ArrayList<>();
        DataInputStream dis = new DataInputStream(new ByteArrayInputStream(buf, 0, len));
        dis.skip(4); // ID + flags
        int qdCount = dis.readUnsignedShort();
        int anCount = dis.readUnsignedShort();
        dis.skip(4); // NSCOUNT + ARCOUNT
        for (int i = 0; i < qdCount; i++) {
            skipDnsName(dis);
            dis.skip(4); // QTYPE + QCLASS
        }
        for (int i = 0; i < anCount; i++) {
            skipDnsName(dis);
            int type  = dis.readUnsignedShort();
            dis.skip(6); // CLASS + TTL
            int rdLen = dis.readUnsignedShort();
            if (type == 1 && rdLen == 4) { // A record
                byte[] ip = new byte[4];
                dis.readFully(ip);
                addresses.add(InetAddress.getByAddress(ip));
            } else {
                dis.skip(rdLen);
            }
        }
        return addresses;
    }

    private void skipDnsName(DataInputStream dis) throws IOException {
        int len;
        while ((len = dis.readUnsignedByte()) != 0) {
            if ((len & 0xC0) == 0xC0) { // Pointer (2-byte)
                dis.skip(1);
                return;
            }
            dis.skip(len);
        }
    }

    // -------------------------------------------------------------------------
    // JVM DNS cache seeding — seeds InetAddress's internal cache via reflection
    // so subsequent InetAddress.getAllByName(hostname) calls return the fallback result.
    // Falls back gracefully if the internal API differs across Android versions.
    // -------------------------------------------------------------------------

    private void seedInetAddressCache(String hostname, InetAddress[] addresses) {
        try {
            Field cacheField = InetAddress.class.getDeclaredField("addressCache");
            cacheField.setAccessible(true);
            Object cache = cacheField.get(null);

            Method putMethod = null;
            for (Method m : cache.getClass().getDeclaredMethods()) {
                if ("put".equals(m.getName())) {
                    putMethod = m;
                    putMethod.setAccessible(true);
                    break;
                }
            }

            if (putMethod == null) {
                Log.w(TAG, "DNS cache seeding: could not find put() — skipping");
                return;
            }

            Class<?>[] paramTypes = putMethod.getParameterTypes();
            if (paramTypes.length == 2) {
                // put(String hostname, InetAddress[] addresses)
                putMethod.invoke(cache, hostname, addresses);
            } else if (paramTypes.length == 3) {
                // put(String hostname, long expiryNanos, InetAddress[] addresses)
                long expiry = System.nanoTime() + 600_000_000_000L; // 10 min TTL
                putMethod.invoke(cache, hostname, expiry, addresses);
            } else {
                Log.w(TAG, "DNS cache seeding: unexpected put() signature — skipping");
                return;
            }

            Log.i(TAG, "DNS cache seeded for " + hostname + " (" + addresses.length + " address(es))");
        } catch (Exception e) {
            Log.w(TAG, "DNS cache seeding failed (Android version incompatibility): " + e.getMessage());
        }
    }
}
