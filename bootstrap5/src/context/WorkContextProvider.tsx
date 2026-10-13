import { createContext, useContext, useState, type ReactNode } from "react";

export const workContexts = [
  {
    id: "personal",
    name: "Личное пространство",
    description: "Индивидуальные задачи, заметки и подготовка к встречам.",
    focus: "Подготовить план развития на следующий квартал",
    tasks: 5,
    completed: 3,
    reviews: 1,
    activity: [
      "Обновлён план личного развития",
      "Подготовлены заметки к встрече",
      "Завершён обзор материалов",
    ],
  },
  {
    id: "product",
    name: "Команда продукта",
    description: "Планирование продукта и согласование командных инициатив.",
    focus: "Согласовать приоритеты следующего продуктового цикла",
    tasks: 12,
    completed: 8,
    reviews: 4,
    activity: [
      "Обновлены приоритеты продуктового цикла",
      "Добавлены результаты интервью",
      "Подготовлена повестка командной встречи",
    ],
  },
  {
    id: "research",
    name: "Исследовательская группа",
    description: "Исследования пользовательского опыта и обмен выводами.",
    focus: "Собрать выводы по исследованию нового сценария",
    tasks: 7,
    completed: 4,
    reviews: 2,
    activity: [
      "Собраны наблюдения по интервью",
      "Обновлён план исследования",
      "Подготовлен шаблон отчёта",
    ],
  },
] as const;

export type WorkContextId = (typeof workContexts)[number]["id"];
export type WorkContext = (typeof workContexts)[number];

type WorkContextValue = {
  activeContext: WorkContext;
  contexts: typeof workContexts;
  setActiveContext: (id: WorkContextId) => void;
};

const WorkContextState = createContext<WorkContextValue | null>(null);

export function WorkContextProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState<WorkContextId>("personal");
  const activeContext = workContexts.find((context) => context.id === activeId) ?? workContexts[0];

  return (
    <WorkContextState.Provider
      value={{ activeContext, contexts: workContexts, setActiveContext: setActiveId }}
    >
      {children}
    </WorkContextState.Provider>
  );
}

export function useWorkContext() {
  const context = useContext(WorkContextState);
  if (!context) {
    throw new Error("useWorkContext must be used within WorkContextProvider");
  }
  return context;
}
