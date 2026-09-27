import { useEffect, useState } from 'react';
import { Button, Field, Modal, Textarea } from '@/components';
import { formatDateTime } from '@/utils';
import { useCitaMutations } from '../hooks/useCitaMutations';
import type { Cita } from '../types';

export function AtenderCitaModal({ cita, onClose }: { cita: Cita | null; onClose: () => void }) {
  const { atender } = useCitaMutations();
  const [obs, setObs] = useState('');

  useEffect(() => setObs(''), [cita]);

  return (
    <Modal
      open={cita !== null}
      onClose={onClose}
      title="Registrar atención"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button
            loading={atender.isPending}
            onClick={() => cita && atender.mutate({ id: cita.id, observaciones: obs.trim() || undefined }, { onSuccess: onClose })}
          >
            Marcar como atendida
          </Button>
        </>
      }
    >
      {cita && (
        <>
          <p>
            <strong>{cita.pacienteNombre}</strong> · {formatDateTime(cita.fechaHora)}
          </p>
          {cita.motivo && <p className="muted">Motivo: {cita.motivo}</p>}
          <Field label="Observaciones" htmlFor="obs">
            <Textarea id="obs" rows={4} maxLength={500} value={obs} onChange={(e) => setObs(e.target.value)} />
          </Field>
        </>
      )}
    </Modal>
  );
}
