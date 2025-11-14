import { Card } from "@/shared/components/Card";
import { Button } from "@/shared/components/Button";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">
            Terms & Conditions
          </h1>
          <Link href="/auth">
            <Button variant="outline">Back to Sign Up</Button>
          </Link>
        </div>

        <Card className="p-8 shadow-glow">
          <div className="prose prose-sm max-w-none space-y-6 text-foreground">
            <p className="text-muted-foreground italic">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section>
              <h2 className="text-xl font-bold mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using Ñamy ("the Service"), you accept and
                agree to be bound by the terms and provision of this agreement.
                If you do not agree to these terms, please do not use the
                Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">2. Use of Service</h2>
              <p className="text-muted-foreground mb-2">
                Ñamy provides a platform for discovering restaurant discounts
                and special offers. By using our Service, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account</li>
                <li>Not use the Service for illegal purposes</li>
                <li>Not attempt to interfere with the Service</li>
                <li>Respect the intellectual property of Ñamy and others</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">3. User Accounts</h2>
              <p className="text-muted-foreground">
                You are responsible for maintaining the confidentiality of your
                account credentials and for all activities that occur under your
                account. You agree to immediately notify us of any unauthorized
                use of your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">4. Discounts & Offers</h2>
              <p className="text-muted-foreground mb-2">
                Discounts and offers displayed on Ñamy are:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Subject to availability and merchant terms</li>
                <li>May expire or change without notice</li>
                <li>Not guaranteed to be current or accurate</li>
                <li>Provided by third-party merchants</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Ñamy is not responsible for merchant actions or the quality of
                goods and services provided.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">5. Privacy</h2>
              <p className="text-muted-foreground">
                Your use of the Service is also governed by our Privacy Policy.
                We collect and process personal information as described in our
                Privacy Policy. By using Ñamy, you consent to such collection
                and processing.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">6. Intellectual Property</h2>
              <p className="text-muted-foreground">
                All content on Ñamy, including but not limited to text,
                graphics, logos, images, and software, is the property of Ñamy
                or its licensors and is protected by copyright and other
                intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">7. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                Ñamy provides the Service "as is" without any warranties. We are
                not liable for any direct, indirect, incidental, or
                consequential damages arising from your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">8. Termination</h2>
              <p className="text-muted-foreground">
                We reserve the right to suspend or terminate your account at any
                time for violations of these terms or for any other reason. You
                may also terminate your account at any time by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">9. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We may modify these terms at any time. Your continued use of the
                Service after changes are posted constitutes acceptance of the
                modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">10. Contact Information</h2>
              <p className="text-muted-foreground">
                If you have questions about these terms, please contact us at:
              </p>
              <p className="text-muted-foreground mt-2">
                Email: <a href="mailto:support@namy.com" className="text-primary hover:underline">support@namy.com</a>
              </p>
            </section>

            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                By creating an account, you acknowledge that you have read,
                understood, and agree to be bound by these Terms & Conditions.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
