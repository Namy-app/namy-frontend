import Link from "next/link";

import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";

export default function PrivacyPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <h1 className="text-3xl font-bold text-foreground">
            Política de privacidad – Ñamy
          </h1>
          <div className="flex flex-wrap gap-2">
            <Link href="/terms">
              <Button variant="outline">Términos y Condiciones</Button>
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
              Ñamy respeta tu privacidad y se compromete a proteger tu
              información personal. Esta Política de privacidad explica cómo
              recopilamos, usamos, almacenamos y protegemos tu información
              cuando utilizas la aplicación móvil Ñamy y los servicios
              relacionados.
            </p>

            <section>
              <h2 className="text-xl font-bold mb-3">
                1. Información que recopilamos
              </h2>
              <p className="text-muted-foreground mb-3">
                Cuando usas Ñamy, podemos recopilar los siguientes tipos de
                información:
              </p>

              <h3 className="text-base font-semibold mb-2 text-foreground">
                Información personal
              </h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mb-4">
                <li>Nombre</li>
                <li>Correo electrónico</li>
                <li>Número de teléfono</li>
                <li>Información de perfil proporcionada por el usuario</li>
              </ul>

              <h3 className="text-base font-semibold mb-2 text-foreground">
                Información de uso
              </h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mb-4">
                <li>Actividad en la aplicación</li>
                <li>Negocios consultados</li>
                <li>Ofertas canjeadas</li>
                <li>Interacciones dentro de la aplicación</li>
                <li>Información del dispositivo</li>
              </ul>

              <h3 className="text-base font-semibold mb-2 text-foreground">
                Información de ubicación
              </h3>
              <p className="text-muted-foreground mb-4">
                Si se concede permiso, Ñamy puede acceder a tu ubicación para
                mostrar negocios cercanos y mejorar las recomendaciones locales.
              </p>

              <h3 className="text-base font-semibold mb-2 text-foreground">
                Contenido del usuario
              </h3>
              <p className="text-muted-foreground mb-4">
                Los usuarios pueden cargar imágenes, comentarios u otro
                contenido dentro de funciones de la aplicación, como espacios
                interactivos o áreas de comunidad.
              </p>

              <h3 className="text-base font-semibold mb-2 text-foreground">
                Información de pago
              </h3>
              <p className="text-muted-foreground">
                Si se procesan pagos dentro de la aplicación, la información de
                pago es gestionada de forma segura por proveedores de pago
                externos, como Stripe. Ñamy no almacena los datos completos de
                las tarjetas de pago.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">
                2. Cómo usamos la información
              </h2>
              <p className="text-muted-foreground mb-2">
                Utilizamos la información recopilada para:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Ofrecer acceso a los servicios de la aplicación</li>
                <li>Mostrar negocios y promociones</li>
                <li>Mejorar la experiencia del usuario</li>
                <li>Gestionar recompensas, clasificaciones y beneficios</li>
                <li>Procesar transacciones</li>
                <li>Comunicar actualizaciones importantes</li>
                <li>Prevenir fraude y uso indebido</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">
                3. Compartición de la información
              </h2>
              <p className="text-muted-foreground mb-2">
                No vendemos información personal.
              </p>
              <p className="text-muted-foreground mb-2">
                La información solo puede compartirse cuando sea necesario con:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>
                  Proveedores de servicios que respaldan el funcionamiento de la
                  aplicación
                </li>
                <li>Procesadores de pago</li>
                <li>Proveedores de analíticas</li>
                <li>Autoridades legales cuando la ley lo exija</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">
                4. Contenido generado por usuarios
              </h2>
              <p className="text-muted-foreground mb-2">
                Los usuarios son responsables del contenido que cargan.
              </p>
              <p className="text-muted-foreground">
                Ñamy se reserva el derecho de eliminar contenido que sea
                inapropiado, ofensivo, engañoso o que infrinja las reglas de la
                plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">
                5. Seguridad de los datos
              </h2>
              <p className="text-muted-foreground">
                Aplicamos medidas técnicas y organizativas razonables para
                proteger la información personal contra acceso no autorizado,
                uso indebido o divulgación.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">
                6. Conservación de los datos
              </h2>
              <p className="text-muted-foreground">
                Conservamos la información solo el tiempo necesario para operar
                el servicio, cumplir obligaciones legales y resolver disputas.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">7. Tus derechos</h2>
              <p className="text-muted-foreground mb-2">
                Los usuarios pueden solicitar:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mb-2">
                <li>Acceso a los datos personales</li>
                <li>Corrección de información inexacta</li>
                <li>Eliminación de la cuenta y de los datos personales</li>
              </ul>
              <p className="text-muted-foreground">
                Las solicitudes pueden enviarse a través de los datos de
                contacto que figuran a continuación.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">
                8. Servicios de terceros
              </h2>
              <p className="text-muted-foreground mb-2">
                Ñamy puede utilizar servicios de terceros, incluidos
                procesadores de pago, herramientas de analíticas y proveedores
                de infraestructura en la nube.
              </p>
              <p className="text-muted-foreground">
                Estos proveedores gestionan los datos conforme a sus propias
                políticas de privacidad.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">
                9. Privacidad de los menores
              </h2>
              <p className="text-muted-foreground mb-2">
                Ñamy no está dirigida a menores de 13 años.
              </p>
              <p className="text-muted-foreground">
                No recopilamos a sabiendas información personal de menores.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">
                10. Cambios a esta política
              </h2>
              <p className="text-muted-foreground mb-2">
                Podemos actualizar esta Política de privacidad periódicamente.
              </p>
              <p className="text-muted-foreground">
                Los cambios se publicarán en la aplicación o en canales
                oficiales.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3">11. Contacto</h2>
              <p className="text-muted-foreground mb-2">
                Para preguntas sobre esta Política de privacidad, contacta a:
              </p>
              <p className="text-muted-foreground">
                <a
                  href="mailto:namymexico@gmail.com"
                  className="text-primary hover:underline"
                >
                  namymexico@gmail.com
                </a>
              </p>
              <p className="text-muted-foreground mt-2">App Ñamy</p>
            </section>

            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Esta política debe leerse junto con nuestros{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Términos y Condiciones
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
