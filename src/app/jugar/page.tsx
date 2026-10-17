import { ComingSoon } from "@/components/layout/ComingSoon";
import { PREGUNTAS } from "@/features/questions/bank";

// Provisorio: la ruleta llega en el próximo paso.
export default function JugarPage() {
  return (
    <ComingSoon
      title="¡Muy pronto!"
      text={`Ya tenemos ${PREGUNTAS.length} preguntas listas. Estamos terminando la ruleta.`}
    />
  );
}
