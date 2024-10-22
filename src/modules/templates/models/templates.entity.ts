export type TemplateEntity = {
  id: string;
  title: string;
  tasks: TaskTemplateEntity[];
};

export type TaskTemplateEntity = {
  id: string;
  templateId: string;
  title: string;
  priority: number;
  hours: number;
};
