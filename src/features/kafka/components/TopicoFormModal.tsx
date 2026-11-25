import { useEffect, useState, type FormEvent } from 'react';
import { Button, Field, Input, Modal, Select } from '@/components';
import { useKafkaMutations } from '../hooks/useKafka';
import { errorEntero, errorNombreTopico } from './reglas';

export function TopicoFormModal({ open, onClose, maxReplicacion }: { open: boolean; onClose: () => void; maxReplicacion: number }) {
  const { crearTopico } = useKafkaMutations();
  const [nombre, setNombre] = useState('');
  const [particiones, setParticiones] = useState('3');
  const [replicacion, setReplicacion] = useState('3');
  const [limpieza, setLimpieza] = useState('delete');
  const [retencionHoras, setRetencionHoras] = useState('');
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    setNombre('');
    setParticiones('3');
    setReplicacion(String(Math.min(3, Math.max(1, maxReplicacion))));
    setLimpieza('delete');
    setRetencionHoras('');
    setEnviado(false);
  }, [open, maxReplicacion]);

  const errNombre = errorNombreTopico(nombre);
  const errParticiones = errorEntero(particiones, 1, 50);
  const errReplicacion = errorEntero(replicacion, 1, 3);
  const errRetencion = retencionHoras ? errorEntero(retencionHoras, 1, 8760) : undefined;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setEnviado(true);
    if (errNombre || errParticiones || errReplicacion || errRetencion) return;
    const configuracion: Record<string, string> = { 'cleanup.policy': limpieza };
    if (retencionHoras) configuracion['retention.ms'] = String(Number(retencionHoras) * 3_600_000);
    crearTopico.mutate(
      { nombre: nombre.trim(), particiones: Number(particiones), factorReplicacion: Number(replicacion), configuracion },
      { onSuccess: onClose },
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nuevo tópico"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" form="form-topico" loading={crearTopico.isPending}>Crear</Button>
        </>
      }
    >
      <form id="form-topico" onSubmit={submit} className="form" noValidate>
        <Field label="Nombre" htmlFor="t-nombre" hint="Ej: gestorcitas.demo.pagos" error={enviado ? errNombre : undefined}>
          <Input id="t-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={249} />
        </Field>
        <Field label="Particiones" htmlFor="t-part" hint="Unidad de paralelismo: máximo de consumidores activos por grupo"
          error={enviado ? errParticiones : undefined}>
          <Input id="t-part" type="number" min={1} max={50} value={particiones} onChange={(e) => setParticiones(e.target.value)} />
        </Field>
        <Field label="Factor de replicación" htmlFor="t-rf" hint={`Copias de cada partición (brokers disponibles: ${maxReplicacion})`}
          error={enviado ? errReplicacion : undefined}>
          <Input id="t-rf" type="number" min={1} max={3} value={replicacion} onChange={(e) => setReplicacion(e.target.value)} />
        </Field>
        <Field label="Política de limpieza" htmlFor="t-cp">
          <Select id="t-cp" value={limpieza} onChange={(e) => setLimpieza(e.target.value)}
            options={[
              { value: 'delete', label: 'delete: borra registros al vencer la retención' },
              { value: 'compact', label: 'compact: conserva el último registro de cada clave' },
            ]} />
        </Field>
        <Field label="Retención (horas)" htmlFor="t-ret" hint="Opcional; vacío = valor del broker (7 días)"
          error={enviado ? errRetencion : undefined}>
          <Input id="t-ret" type="number" min={1} value={retencionHoras} onChange={(e) => setRetencionHoras(e.target.value)} />
        </Field>
      </form>
    </Modal>
  );
}
