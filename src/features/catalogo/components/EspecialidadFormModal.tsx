import { useEffect, useState, type FormEvent } from 'react';
import { Button, Field, Input, Modal, Textarea } from '@/components';
import { useCatalogoMutations } from '../hooks/useCatalogoMutations';
import type { Especialidad } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  especialidad?: Especialidad | null;
}

export function EspecialidadFormModal({ open, onClose, especialidad }: Props) {
  const { guardarEspecialidad } = useCatalogoMutations();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [valor, setValor] = useState('');

  useEffect(() => {
    setNombre(especialidad?.nombre ?? '');
    setDescripcion(especialidad?.descripcion ?? '');
    setValor(especialidad ? String(especialidad.valorConsulta) : '');
  }, [especialidad, open]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    guardarEspecialidad.mutate(
      { id: especialidad?.id, body: { nombre: nombre.trim(), descripcion: descripcion.trim() || undefined, valorConsulta: Number(valor) } },
      { onSuccess: onClose },
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={especialidad ? 'Editar especialidad' : 'Nueva especialidad'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" form="form-especialidad" loading={guardarEspecialidad.isPending}>Guardar</Button>
        </>
      }
    >
      <form id="form-especialidad" onSubmit={submit} className="form">
        <Field label="Nombre" htmlFor="esp-nombre">
          <Input id="esp-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required maxLength={80} />
        </Field>
        <Field label="Valor consulta (CLP)" htmlFor="esp-valor">
          <Input id="esp-valor" type="number" min={0} max={1000000} step={500} value={valor} onChange={(e) => setValor(e.target.value)} required />
        </Field>
        <Field label="Descripción" htmlFor="esp-desc">
          <Textarea id="esp-desc" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} maxLength={255} rows={3} />
        </Field>
      </form>
    </Modal>
  );
}
