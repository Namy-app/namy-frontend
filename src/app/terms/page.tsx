import Link from "next/link";

import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";

export default function TermsPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <h1 className="text-3xl font-bold text-foreground">
            Términos y Condiciones
          </h1>
          <div className="flex flex-wrap gap-2">
            <Link href="/privacy">
              <Button variant="outline">Política de privacidad</Button>
            </Link>
            <Link href="/copyright">
              <Button variant="outline">Derechos de autor</Button>
            </Link>
            <Link href="/auth">
              <Button variant="outline">Volver al registro</Button>
            </Link>
          </div>
        </div>

        <Card className="p-8 shadow-glow">
          <div className="prose prose-sm max-w-none space-y-6 text-foreground">
            <p className="text-muted-foreground italic">
              Fecha de vigencia: 26/3/2026
            </p>

            <p className="text-muted-foreground">
              Bienvenido a Ñamy. Al utilizar esta aplicación, aceptas los
              presentes Términos y Condiciones.
            </p>

            <section>
              <h2 className="text-xl font-bold mb-3">
                1. Uso de la aplicación
              </h2>
              <p className="text-muted-foreground mb-2">
                Ñamy es una plataforma digital que permite descubrir negocios
                locales participantes y acceder a beneficios, promociones y
                experiencias disponibles dentro de la aplicación.
              </p>
              <p className="text-muted-foreground">
                El uso de la aplicación está permitido únicamente para fines
                personales y no comerciales.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">
                2. Beneficios y promociones
              </h2>
              <p className="text-muted-foreground mb-2">
                Los beneficios, promociones y descuentos mostrados en Ñamy son
                ofrecidos por negocios participantes y están sujetos a
                disponibilidad, horarios, condiciones particulares y cambios sin
                previo aviso.
              </p>
              <p className="text-muted-foreground mb-2">
                Cada negocio puede establecer condiciones específicas para
                aplicar sus beneficios.
              </p>
              <p className="text-muted-foreground">
                Ñamy no garantiza disponibilidad permanente de promociones ni
                responsabilidad sobre cambios realizados por negocios aliados.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">
                3. Responsabilidad del usuario
              </h2>
              <p className="text-muted-foreground mb-2">
                El usuario se compromete a utilizar la aplicación de forma
                adecuada, respetuosa y conforme a la ley.
              </p>
              <p className="text-muted-foreground mb-2">Queda prohibido:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>proporcionar información falsa</li>
                <li>intentar manipular promociones</li>
                <li>duplicar beneficios de forma indebida</li>
                <li>afectar el funcionamiento de la plataforma</li>
                <li>
                  utilizar múltiples cuentas para obtener ventajas indebidas
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">
                4. Contenido generado por usuarios
              </h2>
              <p className="text-muted-foreground mb-2">
                Si el usuario publica imágenes, comentarios o contenido dentro
                de espacios interactivos de la aplicación:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mb-2">
                <li>garantiza que posee derechos sobre dicho contenido</li>
                <li>
                  acepta no publicar contenido ofensivo, ilegal o inapropiado
                </li>
                <li>
                  autoriza a Ñamy a moderar, ocultar o eliminar contenido cuando
                  sea necesario
                </li>
              </ul>
              <p className="text-muted-foreground">
                Ñamy podrá suspender cuentas por uso indebido.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">
                5. Rankings, dinámicas y premios
              </h2>
              <p className="text-muted-foreground mb-2">
                Las dinámicas, rankings y premios promocionales pueden variar
                según campañas activas.
              </p>
              <p className="text-muted-foreground mb-2">
                Los premios ofrecidos por negocios participantes están sujetos a
                disponibilidad y condiciones específicas.
              </p>
              <p className="text-muted-foreground">
                Ñamy se reserva el derecho de modificar reglas o cancelar
                dinámicas cuando sea necesario.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">
                6. Suspensión o cancelación de cuentas
              </h2>
              <p className="text-muted-foreground mb-2">
                Ñamy podrá limitar o suspender cuentas en caso de:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>uso fraudulento</li>
                <li>abuso de promociones</li>
                <li>incumplimiento de estos términos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">
                7. Limitación de responsabilidad
              </h2>
              <p className="text-muted-foreground mb-2">
                Ñamy actúa como plataforma intermediaria entre usuarios y
                negocios participantes.
              </p>
              <p className="text-muted-foreground">
                La calidad de productos, servicios o experiencias ofrecidas
                corresponde directamente a cada negocio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">
                8. Cambios en la plataforma
              </h2>
              <p className="text-muted-foreground">
                Ñamy podrá actualizar funciones, promociones, beneficios o
                condiciones de uso en cualquier momento.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">9. Protección de datos</h2>
              <p className="text-muted-foreground">
                El tratamiento de datos personales se realiza conforme al{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Aviso de Privacidad
                </Link>{" "}
                correspondiente.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">10. Aceptación</h2>
              <p className="text-muted-foreground">
                El uso continuo de Ñamy implica aceptación de estos términos.
              </p>
            </section>

            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Al crear una cuenta, reconoces haber leído y aceptado estos
                Términos y Condiciones y nuestra{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Política de privacidad
                </Link>
                .
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
