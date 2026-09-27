import { useEffect, useState, type FormEvent } from 'react';
import { Button, Field, Input, Modal } from '@/components';
import { EspecialidadSelect } from '@/features/catalogo';
import { useAdminUsuarioMutations } from '../hooks/useAdminUsuarios';
import type { Usuario } from '../types';

export function EditarMedicoModal({ usuario, onClose }: { usuario: Usuario | null; onClose: () => void }) {
  const { asignarPerfilMedico } = useAdminUsuarioMutations();
  const [nombre, setNombre] = useState('');
  const [especialidadId, setEspecialidadId] = useState<number | ''>('');
  const [registro, setRegistro] = useState('');

  useEffect(() => {
    setNombre(usuario?.nombre ?? '');
    setEspecialidadId(usuario?.perfilMedico?.especialidadId ?? '');
    setRegistro(usuario?.perfilMedico?.registroProfesional ?? '');
  }, [usuario]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!usuario || especialidadId === '') return;
    asignarPerfilMedico.mutate(
      { id: usuario.id, body: { nombre: nombre.trim(), especialidadId, registroProfesional: registro.trim() } },
      { onSuccess: onClose },
    );
  };

  return (
    <Modal
      open={usuario !== null}
      onClose={onClose}
      title="Datos profesionales del médico"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" form="form-editar-medico" loading={asignarPerfilMedico.isPending}>Guardar</Button>
        </>
      }
    >
      <form id="form-editar-medico" className="form" onSubmit={submit}>
        <p className="muted">{usuario?.email}</p>
        <Field label="Nombre" htmlFor="em-nombre">
          <Input id="em-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required maxLength={120} />
        </Field>
        <Field label="Especialidad" htmlFor="em-esp">
          <EspecialidadSelect id="em-esp" value={especialidadId} onChange={setEspecialidadId} />
        </Field>
        <Field label="Registro profesional (SIS)" htmlFor="em-reg">
          <Input id="em-reg" value={registro} onChange={(e) => setRegistro(e.target.value)} required maxLength={30} />
        </Field>
      </form>
    </Modal>
  );
}
