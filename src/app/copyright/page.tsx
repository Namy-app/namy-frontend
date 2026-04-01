import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";

export const metadata: Metadata = {
  title: "Aviso de derechos de autor – Ñamy",
  description:
    "Información de propiedad intelectual, marca y derechos de autor de la aplicación Ñamy.",
};

export default function CopyrightPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <h1 className="text-3xl font-bold text-foreground">
            Aviso de derechos de autor
          </h1>
          <div className="flex flex-wrap gap-2">
            <Link href="/terms">
              <Button variant="outline">Términos y Condiciones</Button>
            </Link>
            <Link href="/privacy">
              <Button variant="outline">Política de privacidad</Button>
            </Link>
            <Link href="/auth">
              <Button variant="outline">Volver al registro</Button>
            </Link>
          </div>
        </div>

        <Card className="p-8 shadow-glow">
          <div className="prose prose-sm max-w-none space-y-6 text-foreground">
            <p className="text-muted-foreground italic">
              Última actualización: 30 de marzo de 2026
            </p>

            <section>
              <h2 className="text-xl font-bold mb-3">Propiedad intelectual</h2>
              <p className="text-muted-foreground mb-2">
                La aplicación móvil y web <strong>Ñamy</strong>, su nombre,
                logotipo, diseño de interfaz, textos propios, compilación de
                contenidos y software asociado son obra y propiedad de sus
                titulares legítimos, salvo que se indique lo contrario.
              </p>
              <p className="text-muted-foreground">
                Quedan reservados todos los derechos no expresamente concedidos
                al usuario en los{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Términos y Condiciones
                </Link>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">Marca</h2>
              <p className="text-muted-foreground">
                <strong>Ñamy</strong> y los elementos distintivos asociados
                pueden constituir marcas o signos distintivos. Su uso no
                autorizado, que pueda generar confusión o menoscabo, está
                prohibido sin consentimiento previo por escrito de quien
                corresponda.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">Contenido de terceros</h2>
              <p className="text-muted-foreground mb-2">
                Algunos textos, imágenes, marcas o datos mostrados en la
                aplicación pertenecen a negocios aliados, proveedores o
                licenciantes. Dichos materiales se publican conforme a acuerdos
                o licencias aplicables y permanecen bajo la titularidad de sus
                respectivos dueños.
              </p>
              <p className="text-muted-foreground">
                Los mapas y servicios de ubicación pueden depender de terceros
                (por ejemplo, Google) y están sujetos a sus propios términos y
                políticas.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">Uso permitido</h2>
              <p className="text-muted-foreground">
                El uso de la aplicación no implica cesión de derechos de autor,
                marcas u otros derechos de propiedad intelectual. Cualquier
                reproducción, distribución o modificación no autorizada puede
                constituir una infracción legal.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">Consultas</h2>
              <p className="text-muted-foreground">
                Para asuntos relacionados con propiedad intelectual o este
                aviso, utiliza los canales de contacto indicados en la sección
                de ayuda o soporte de la aplicación o del sitio web oficial.
              </p>
            </section>

            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-sm font-medium text-foreground text-center">
                © {new Date().getFullYear()} Ñamy. Todos los derechos
                reservados.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
