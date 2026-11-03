import { useEffect, useState, type FormEvent } from 'react';
import { Button, Field, Input, Modal, Select } from '@/components';
import { useExchanges, useMensajeriaMutations } from '../hooks/useMensajeria';
import { errorNombre, errorRoutingKey } from './reglas';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ColaFormModal({ open, onClose }: Props) {
  const { crearCola } = useMensajeriaMutations();
  const { data: exchanges = [] } = useExchanges();
  const [nombre, setNombre] = useState('');
  const [durable, setDurable] = useState(true);
  const [ttl, setTtl] = useState('');
  const [dlx, setDlx] = useState('');
  const [dlrk, setDlrk] = useState('');
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    setNombre('');
    setDurable(true);
    setTtl('');
    setDlx('');
    setDlrk('');
    setEnviado(false);
  }, [open]);

  const errNombre = errorNombre(nombre);
  const errDlrk = errorRoutingKey(dlrk) ?? (dlrk && !dlx ? 'Requiere elegir un dead letter exchange' : undefined);
  const errTtl = ttl && (!Number.isInteger(Number(ttl)) || Number(ttl) <= 0) ? 'Debe ser un entero mayor que 0' : undefined;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setEnviado(true);
    if (errNombre || errDlrk || errTtl) return;
    crearCola.mutate(
      {
        nombre: nombre.trim(),
        durable,
        ttlMs: ttl ? Number(ttl) : undefined,
        deadLetterExchange: dlx || undefined,
        deadLetterRoutingKey: dlrk || undefined,
      },
      { onSuccess: onClose },
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nueva cola"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" form="form-cola" loading={crearCola.isPending}>Crear</Button>
        </>
      }
    >
      <form id="form-cola" onSubmit={submit} className="form" noValidate>
        <Field label="Nombre" htmlFor="cola-nombre" hint="Ej: q.demo.pagos" error={enviado ? errNombre : undefined}>
          <Input id="cola-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={255} />
        </Field>
        <label className="checkbox">
          <input type="checkbox" checked={durable} onChange={(e) => setDurable(e.target.checked)} /> Durable (sobrevive a reinicios)
        </label>
        <Field label="TTL de mensajes (ms)" htmlFor="cola-ttl" hint="Opcional" error={enviado ? errTtl : undefined}>
          <Input id="cola-ttl" type="number" min={1} value={ttl} onChange={(e) => setTtl(e.target.value)} />
        </Field>
        <Field label="Dead letter exchange" htmlFor="cola-dlx" hint="Opcional: a dónde van los mensajes rechazados">
          <Select
            id="cola-dlx"
            value={dlx}
            onChange={(e) => setDlx(e.target.value)}
            placeholder="Sin dead letter"
            options={exchanges.map((x) => ({ value: x.nombre, label: `${x.nombre} (${x.tipo})` }))}
          />
        </Field>
        <Field label="Dead letter routing key" htmlFor="cola-dlrk" hint="Opcional" error={enviado ? errDlrk : undefined}>
          <Input id="cola-dlrk" value={dlrk} onChange={(e) => setDlrk(e.target.value)} maxLength={255} />
        </Field>
      </form>
    </Modal>
  );
}
