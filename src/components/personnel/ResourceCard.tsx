import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import type { WelfareResource } from '@/services/resourceService';

interface ResourceCardProps {
  resource: WelfareResource;
  onAction?: (resource: WelfareResource) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onAction }) => {
  return (
    <Card className="bg-surface p-5 flex flex-col justify-between h-full space-y-4 select-none">
      <div className="space-y-2">
        <div className="flex justify-between items-start gap-3">
          <Badge variant="secondary" className="text-[10px] font-bold py-0.5 select-none uppercase tracking-wide">
            {resource.category}
          </Badge>
        </div>
        <h4 className="font-bold text-textPrimary text-base leading-tight">
          {resource.title}
        </h4>
        <p className="text-xs text-textSecondary leading-relaxed">
          {resource.description}
        </p>
        {resource.contactInfo && (
          <div className="text-[11px] font-semibold text-textMuted bg-surfaceAlt/60 border border-border/40 p-2 rounded">
            Contact: {resource.contactInfo}
          </div>
        )}
      </div>

      {resource.actionLabel && (
        <div className="pt-2 border-t border-border/40">
          <Button
            variant="secondary"
            size="sm"
            className="w-full text-xs font-semibold"
            onClick={() => onAction && onAction(resource)}
          >
            {resource.actionLabel}
          </Button>
        </div>
      )}
    </Card>
  );
};
export default ResourceCard;
