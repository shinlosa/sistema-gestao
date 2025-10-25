import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";

interface RevisionRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (justification: string) => void;
  defaultSummary: string;
}

export function RevisionRequestModal({ open, onClose, onSubmit, defaultSummary }: RevisionRequestModalProps) {
  const [justification, setJustification] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!justification.trim()) return;
    onSubmit(justification.trim());
    setJustification("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Solicitar revisão de reserva</DialogTitle>
          <DialogDescription>
            Informe o motivo e os detalhes para priorização. O administrador avaliará sua solicitação.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Resumo da solicitação</Label>
            <div className="text-sm text-muted-foreground mt-1">{defaultSummary}</div>
          </div>
          <div>
            <Label htmlFor="justification">Justificativa</Label>
            <Textarea
              id="justification"
              placeholder="Descreva o tipo de atendimento e o motivo da prioridade"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              rows={5}
              className="mt-1"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Enviar solicitação</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
