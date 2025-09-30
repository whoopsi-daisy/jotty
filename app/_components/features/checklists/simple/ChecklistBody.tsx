import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ChecklistProgress } from "./ChecklistProgress";
import { ChecklistItemsWrapper } from "./ChecklistItemsWrapper";
import { ChecklistItem } from "./ChecklistItem";
import { Checklist, Item } from "@/app/_types";

interface ChecklistBodyProps {
  localList: Checklist;
  incompleteItems: Item[];
  completedItems: Item[];
  handleToggleItem: (itemId: string, completed: boolean) => void;
  handleDeleteItem: (itemId: string) => void;
  handleEditItem: (itemId: string, text: string) => void;
  handleBulkToggle: (completed: boolean) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  sensors: any;
  isLoading: boolean;
}

export const ChecklistBody = ({
  localList,
  incompleteItems,
  completedItems,
  handleToggleItem,
  handleDeleteItem,
  handleEditItem,
  handleBulkToggle,
  handleDragEnd,
  sensors,
  isLoading,
}: ChecklistBodyProps) => {
  if (localList.items.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border m-4 p-8 text-center">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No items yet
        </h3>
        <p className="text-muted-foreground">
          Add your first item to get started!
        </p>
      </div>
    );
  }

  return (
    <>
      {localList.items.length > 0 && (
        <ChecklistProgress checklist={localList} />
      )}
      <div className="flex-1 overflow-y-auto p-4 pb-24 lg:pb-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={localList.items.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="w-full space-y-4">
              {incompleteItems.length > 0 && (
                <ChecklistItemsWrapper
                  title="To Do"
                  count={incompleteItems.length}
                  onBulkToggle={() => handleBulkToggle(true)}
                  isLoading={isLoading}
                >
                  {incompleteItems.map((item, index) => (
                    <ChecklistItem
                      key={item.id}
                      item={item}
                      index={index}
                      onToggle={handleToggleItem}
                      onDelete={handleDeleteItem}
                      onEdit={handleEditItem}
                    />
                  ))}
                </ChecklistItemsWrapper>
              )}
              {completedItems.length > 0 && (
                <ChecklistItemsWrapper
                  title="Completed"
                  count={completedItems.length}
                  onBulkToggle={() => handleBulkToggle(false)}
                  isLoading={isLoading}
                  isCompleted
                >
                  {completedItems.map((item, index) => (
                    <ChecklistItem
                      key={item.id}
                      item={item}
                      index={incompleteItems.length + index}
                      onToggle={handleToggleItem}
                      onDelete={handleDeleteItem}
                      onEdit={handleEditItem}
                      completed
                    />
                  ))}
                </ChecklistItemsWrapper>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </>
  );
};
