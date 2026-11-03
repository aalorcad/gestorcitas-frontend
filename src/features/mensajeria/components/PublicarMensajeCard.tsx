import { useState, type FormEvent } from 'react';
import { Alert, Button, Card, Field, Input, Select, Textarea } from '@/components';
import { useExchanges, useMensajeriaMutations } from '../hooks/useMensajeria';

/** Ejemplos listos para la demo: flujo normal, reintentos y DLQ. */
const EJEMPLOS = {
  valido: {
    label: 'Evento de cita válido (se procesa y ACK)',
    exchange: 'gestorcitas.citas.eventos',
    routingKey: 'cita.creada',
    payload: {
      eventoId: 'demo-1', tipo: 'CREADA', citaId: 999, pacienteNombre: 'Paciente Demo',
      pacienteEmail: 'paciente@demo.cl', medicoNombre: 'Dra. Demo', especialidadNombre: 'Medicina General',
      fechaHora: '2026-12-01T10:00:00', estado: 'PENDIENTE',
    },
  },
  invalido: {
    label: 'Evento incompleto (NACK directo a la DLQ)',
    exchange: 'gestorcitas.citas.eventos',
    routingKey: 'cita.creada',
    payload: { eventoId: 'demo-2', tipo: 'CREADA' },
  },
  transitorio: {
    label: 'Correo caído (3 reintentos y luego DLQ)',
    exchange: 'gestorcitas.citas.eventos',
    routingKey: 'cita.confirmada',
    payload: {
      eventoId: 'demo-3', tipo: 'CONFIRMADA', citaId: 1000, pacienteNombre: 'Paciente Demo',
      pacienteEmail: 'paciente@falla.test', medicoNombre: 'Dra. Demo', especialidadNombre: 'Medicina General',
      fechaHora: '2026-12-01T10:30:00', estado: 'CONFIRMADA',
    },
  },
} as const;

type Ejemplo = keyof typeof EJEMPLOS;

export function PublicarMensajeCard() {
  const { publicar } = useMensajeriaMutations();
  const { data: exchanges = [] } = useExchanges();
  const [exchange, setExchange] = useState<string>(EJEMPLOS.valido.exchange);
  const [routingKey, setRoutingKey] = useState<string>(EJEMPLOS.valido.routingKey);
  const [json, setJson] = useState(JSON.stringify(EJEMPLOS.valido.payload, null, 2));
  const [errorJson, setErrorJson] = useState<string>();

  const cargar = (e: Ejemplo) => {
    const ej = EJEMPLOS[e];
    setExchange(ej.exchange);
    setRoutingKey(ej.routingKey);
    setJson(JSON.stringify(ej.payload, null, 2));
    setErrorJson(undefined);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    let payload: unknown;
    try {
      payload = JSON.parse(json);
    } catch {
      setErrorJson('El contenido no es un JSON válido');
      return;
    }
    setErrorJson(undefined);
    publicar.mutate({ exchange, routingKey, payload });
  };

  return (
    <Card title="Publicar mensaje de prueba" subtitle="Demuestra el enrutamiento, los reintentos y el envío a la DLQ">
      <Alert>
        Elige un ejemplo, publícalo y observa en la pestaña <strong>Colas</strong> cómo cambia el contador de la cola y de su DLQ
        (se actualiza cada 5 segundos).
      </Alert>
      <div className="table__actions" style={{ margin: '12px 0', flexWrap: 'wrap' }}>
        {(Object.keys(EJEMPLOS) as Ejemplo[]).map((k) => (
          <Button key={k} size="sm" variant="secondary" type="button" onClick={() => cargar(k)}>
            {EJEMPLOS[k].label}
          </Button>
        ))}
      </div>
      <form className="form" onSubmit={submit} noValidate>
        <Field label="Exchange" htmlFor="pub-ex">
          <Select id="pub-ex" value={exchange} onChange={(e) => setExchange(e.target.value)}
            options={exchanges.map((x) => ({ value: x.nombre, label: `${x.nombre} (${x.tipo})` }))} />
        </Field>
        <Field label="Routing key" htmlFor="pub-rk">
          <Input id="pub-rk" value={routingKey} onChange={(e) => setRoutingKey(e.target.value)} />
        </Field>
        <Field label="Payload (JSON)" htmlFor="pub-json" error={errorJson}>
          <Textarea id="pub-json" className="code-input" rows={10} value={json} onChange={(e) => setJson(e.target.value)} />
        </Field>
        <div>
          <Button type="submit" loading={publicar.isPending}>Publicar</Button>
        </div>
      </form>
    </Card>
  );
}
