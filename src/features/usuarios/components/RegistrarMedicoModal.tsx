import { useEffect, useState, type FormEvent } from 'react';
import { Button, Field, Input, Modal } from '@/components';
import { EspecialidadSelect } from '@/features/catalogo';
import { useAdminUsuarioMutations } from '../hooks/useAdminUsuarios';

export function RegistrarMedicoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { registrarMedico } = useAdminUsuarioMutations();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [especialidadId, setEspecialidadId] = useState<number | ''>('');
  const [registro, setRegistro] = useState('');

  useEffect(() => {
    if (!open) return;
    setNombre('');
    setEmail('');
    setTelefono('');
    setEspecialidadId('');
    setRegistro('');
  }, [open]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (especialidadId === '') return;
    registrarMedico.mutate(
      {
        nombre: nombre.trim(),
        email: email.trim(),
        telefono: telefono.trim() || undefined,
        especialidadId,
        registroProfesional: registro.trim(),
      },
      { onSuccess: onClose },
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Registrar médico"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" form="form-registrar-medico" loading={registrarMedico.isPending}>Registrar</Button>
        </>
      }
    >
      <form id="form-registrar-medico" className="form" onSubmit={submit}>
        <Field label="Nombre completo" htmlFor="rm-nombre">
          <Input id="rm-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required maxLength={120} />
        </Field>
        <Field label="Email (cuenta Entra ID)" htmlFor="rm-email" hint="Debe ser el mismo UPN del usuario en Entra ID, con el App Role Medico asignado.">
          <Input id="rm-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={150} />
        </Field>
        <Field label="Especialidad" htmlFor="rm-esp">
          <EspecialidadSelect id="rm-esp" value={especialidadId} onChange={setEspecialidadId} />
        </Field>
        <Field label="Registro profesional (SIS)" htmlFor="rm-reg">
          <Input id="rm-reg" value={registro} onChange={(e) => setRegistro(e.target.value)} required maxLength={30} />
        </Field>
        <Field label="Teléfono" htmlFor="rm-tel" hint="Opcional">
          <Input id="rm-tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} maxLength={16} />
        </Field>
      </form>
    </Modal>
  );
}
