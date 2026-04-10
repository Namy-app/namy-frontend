package namyapp.com;

import android.os.Bundle;
import android.view.View;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Do NOT let Android automatically fit system windows — we handle it manually.
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);

        // Apply bottom inset (nav bar) as padding on the root view so the
        // WebView content never goes behind the 3-button or gesture nav bar.
        // Only pad the bottom (nav bar) — the top (status bar) is handled
        // via CSS --status-bar-height in the web layer.
        View rootView = findViewById(android.R.id.content);
        ViewCompat.setOnApplyWindowInsetsListener(rootView, (view, insets) -> {
            int bottomInset = insets.getInsets(WindowInsetsCompat.Type.navigationBars()).bottom;
            view.setPadding(0, 0, 0, bottomInset);
            return WindowInsetsCompat.CONSUMED;
        });
    }
}
