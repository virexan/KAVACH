import React from 'react';
import { useQuery } from '@tanstack/react-query';
import assistantService from '@/services/assistantService';
import Modal from '../ui/Modal';
import Skeleton from '../ui/Skeleton';

interface Props {
  citation: { id: string; title: string; section?: string } | null;
  onClose: () => void;
}

export const SourceDrawer: React.FC<Props> = ({ citation, onClose }) => {
  const { data: searchRes, isLoading } = useQuery({
    queryKey: ['assistant-knowledge-base-source', citation?.title],
    queryFn: () => assistantService.searchKnowledge(citation?.title || ''),
    enabled: !!citation,
  });

  const foundDoc = searchRes?.data?.[0];

  return (
    <Modal
      isOpen={!!citation}
      onClose={onClose}
      title={citation?.title || 'Knowledge Base Document'}
      className="max-w-md w-full font-sans"
    >
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton variant="line" className="h-6 w-1/3" />
          <Skeleton variant="block" className="h-32 w-full" />
        </div>
      ) : foundDoc ? (
        <div className="space-y-4 font-sans text-left text-xs leading-relaxed animate-fadeIn select-none font-sans">
          <div className="flex justify-between items-center border-b border-border pb-2">
            <span className="font-bold text-textSecondary uppercase text-[9px] bg-surfaceAlt border border-border px-2 py-0.5 rounded">
              Type: {foundDoc.type} {foundDoc.version ? `(${foundDoc.version})` : ''}
            </span>
            <span className="text-[10px] text-textMuted font-bold">
              Updated: {foundDoc.updatedAt}
            </span>
          </div>

          {citation?.section && (
            <div className="bg-primary/10 border border-primary/20 p-2 rounded text-[10px] text-primary font-bold">
              📍 Referenced Section: {citation.section}
            </div>
          )}

          <div className="space-y-2 border border-border bg-surfaceAlt/20 p-4 rounded text-textSecondary font-medium leading-relaxed max-h-[40vh] overflow-y-auto font-sans">
            <p className="whitespace-pre-line font-sans">{foundDoc.content}</p>
          </div>

          <div className="text-[10px] text-textMuted leading-relaxed bg-surfaceAlt/40 p-2.5 rounded border border-border/60 font-sans">
            ℹ️ <strong>RAG Verification Statement (FR-18):</strong> Excerpts are retrieved from official force welfare policies and workload guidelines.
          </div>
        </div>
      ) : (
        <div className="text-center text-xs text-textMuted p-4 select-none font-sans">
          This document citation details aren't synced in local prototype vector store.
        </div>
      )}
    </Modal>
  );
};
export default SourceDrawer;
