import { useEffect, useState, type FormEvent } from 'react';
import { Button, Field, Input, Modal, Select } from '@/components';
import { useMensajeriaMutations } from '../hooks/useMensajeria';
import type { TipoExchange } from '../types';
import { errorNombre } from './reglas';

const TIPOS: TipoExchange[] = ['direct', 'topic', 'fanout', 'headers'];

export function ExchangeFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { crearExchange } = useMensajeriaMutations();
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState<TipoExchange>('topic');
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    setNombre('');
    setTipo('topic');
    setEnviado(false);
  }, [open]);

  const errNombre = errorNombre(nombre);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setEnviado(true);
    if (errNombre) return;
    crearExchange.mutate({ nombre: nombre.trim(), tipo, durable: true }, { onSuccess: onClose });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nuevo exchange"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" form="form-exchange" loading={crearExchange.isPending}>Crear</Button>
        </>
      }
    >
      <form id="form-exchange" onSubmit={submit} className="form" noValidate>
        <Field label="Nombre" htmlFor="ex-nombre" hint="Ej: gestorcitas.demo" error={enviado ? errNombre : undefined}>
          <Input id="ex-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={255} />
        </Field>
        <Field label="Tipo" htmlFor="ex-tipo">
          <Select
            id="ex-tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoExchange)}
            options={TIPOS.map((t) => ({ value: t, label: t }))}
          />
        </Field>
      </form>
    </Modal>
  );
}
