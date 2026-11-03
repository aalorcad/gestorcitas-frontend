import { useEffect, useState, type FormEvent } from 'react';
import { Button, Field, Input, Modal, Select } from '@/components';
import { useColas, useExchanges, useMensajeriaMutations } from '../hooks/useMensajeria';
import { errorRoutingKey } from './reglas';

export function BindingFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { crearBinding } = useMensajeriaMutations();
  const { data: exchanges = [] } = useExchanges();
  const { data: colas = [] } = useColas();
  const [exchange, setExchange] = useState('');
  const [cola, setCola] = useState('');
  const [routingKey, setRoutingKey] = useState('');
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    setExchange('');
    setCola('');
    setRoutingKey('');
    setEnviado(false);
  }, [open]);

  const tipo = exchanges.find((x) => x.nombre === exchange)?.tipo;
  const errRk =
    errorRoutingKey(routingKey) ??
    (tipo && tipo !== 'topic' && /[*#]/.test(routingKey) ? "Los comodines '*' y '#' solo sirven en exchanges topic" : undefined);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setEnviado(true);
    if (!exchange || !cola || errRk) return;
    crearBinding.mutate({ exchange, cola, routingKey }, { onSuccess: onClose });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nuevo binding"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" form="form-binding" loading={crearBinding.isPending}>Crear</Button>
        </>
      }
    >
      <form id="form-binding" onSubmit={submit} className="form" noValidate>
        <Field label="Exchange" htmlFor="b-ex" error={enviado && !exchange ? 'Elige un exchange' : undefined}>
          <Select id="b-ex" value={exchange} onChange={(e) => setExchange(e.target.value)} placeholder="Selecciona…"
            options={exchanges.map((x) => ({ value: x.nombre, label: `${x.nombre} (${x.tipo})` }))} />
        </Field>
        <Field label="Cola" htmlFor="b-cola" error={enviado && !cola ? 'Elige una cola' : undefined}>
          <Select id="b-cola" value={cola} onChange={(e) => setCola(e.target.value)} placeholder="Selecciona…"
            options={colas.map((c) => ({ value: c.nombre, label: c.nombre }))} />
        </Field>
        <Field label="Routing key" htmlFor="b-rk" hint={tipo === 'topic' ? "Admite '*' (una palabra) y '#' (cero o más)" : 'Clave exacta'}
          error={enviado ? errRk : undefined}>
          <Input id="b-rk" value={routingKey} onChange={(e) => setRoutingKey(e.target.value)} maxLength={255} />
        </Field>
      </form>
    </Modal>
  );
}
