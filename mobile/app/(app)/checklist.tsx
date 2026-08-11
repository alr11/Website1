import * as React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/Screen";
import {
  Button,
  Card,
  Checkbox,
  EmptyState,
  ErrorState,
  LoadingState,
  FormSheet,
  ProgressBar,
  SelectField,
  TextField,
} from "@/components/ui";
import { TIMELINE_PHASES } from "@/lib/constants";
import { daysUntil, formatDate } from "@/lib/format";
import {
  summariseTasks,
  useCreateTask,
  useDeleteTask,
  useTimelineTasks,
  useToggleTask,
} from "@/lib/hooks/use-timeline";
import { colors, fonts } from "@/lib/theme";
import { compareTasks, dueDateForPhase } from "@/lib/timeline";
import { useWeddingSettings } from "@/lib/hooks/use-wedding";
import type { TimelinePhase, TimelineTask } from "@/lib/types";

type Filter = "all" | "open" | "done";

export default function ChecklistScreen() {
  const { data: settings } = useWeddingSettings();
  const { data, isPending, isError, error, refetch, isFetching } = useTimelineTasks();
  const toggleTask = useToggleTask();
  const createTask = useCreateTask();
  const deleteTask = useDeleteTask();

  const [filter, setFilter] = React.useState<Filter>("all");
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [phase, setPhase] = React.useState<TimelinePhase>("6_months");

  const tasks = React.useMemo(() => data ?? [], [data]);
  const stats = React.useMemo(() => summariseTasks(tasks), [tasks]);

  const visible = React.useMemo(() => {
    if (filter === "open") return tasks.filter((task) => !task.completed);
    if (filter === "done") return tasks.filter((task) => task.completed);
    return tasks;
  }, [tasks, filter]);

  const groups = React.useMemo(
    () =>
      TIMELINE_PHASES.map((config) => {
        const all = tasks.filter((task) => task.phase === config.value);
        return {
          ...config,
          tasks: visible.filter((task) => task.phase === config.value).sort(compareTasks),
          done: all.filter((task) => task.completed).length,
          total: all.length,
        };
      }).filter((group) => group.total > 0),
    [tasks, visible],
  );

  async function submitTask() {
    if (!title.trim()) return;
    try {
      await createTask.mutateAsync({
        title: title.trim(),
        notes: notes.trim() || null,
        phase,
        due_date: dueDateForPhase(settings?.wedding_date, phase),
      });
      setTitle("");
      setNotes("");
      setSheetOpen(false);
    } catch {
      // Reported as a toast by the hook.
    }
  }

  function confirmDelete(task: TimelineTask) {
    Alert.alert("Remove this task?", `"${task.title}" will be deleted from your checklist.`, [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => deleteTask.mutate(task.id) },
    ]);
  }

  return (
    <Screen
      title="Checklist"
      description="Counted back from your wedding date."
      action={<Button title="Add" onPress={() => setSheetOpen(true)} />}
      onRefresh={refetch}
      refreshing={isFetching && !isPending}
    >
      <Card>
        <Text style={styles.progressLabel}>OVERALL PROGRESS</Text>
        <Text style={styles.progressValue}>
          {stats.completed}
          <Text style={{ color: colors.muted }}> / {stats.total}</Text>
        </Text>
        <Text style={styles.meta}>
          {stats.remaining} task{stats.remaining === 1 ? "" : "s"} still to do
        </Text>
        <View style={{ marginTop: 14 }}>
          <ProgressBar value={stats.percentComplete} tone="sage" />
        </View>
        <Text style={styles.percent}>{Math.round(stats.percentComplete)}% complete</Text>
      </Card>

      <View style={styles.tabs}>
        {(["all", "open", "done"] as const).map((key) => (
          <Pressable
            key={key}
            accessibilityRole="tab"
            accessibilityState={{ selected: filter === key }}
            onPress={() => setFilter(key)}
            style={[styles.tab, filter === key && styles.tabActive]}
          >
            <Text style={[styles.tabText, filter === key && styles.tabTextActive]}>
              {key === "all" ? "All" : key === "open" ? "To do" : "Done"}
            </Text>
          </Pressable>
        ))}
      </View>

      {isPending ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : tasks.length === 0 ? (
        <EmptyState
          title="Your checklist is empty"
          description="Add your first task and it will slot into the right phase of the timeline."
          action={<Button title="Add a task" onPress={() => setSheetOpen(true)} />}
        />
      ) : (
        groups.map((group) => (
          <Card key={group.value}>
            <View style={styles.groupHead}>
              <View style={{ flex: 1 }}>
                <Text style={styles.groupTitle}>{group.label}</Text>
                <Text style={styles.meta}>{group.description}</Text>
              </View>
              <Text style={styles.count}>
                {group.done}/{group.total}
              </Text>
            </View>

            {group.tasks.length === 0 ? (
              <Text style={[styles.meta, { marginTop: 12 }]}>
                Nothing to show with this filter.
              </Text>
            ) : (
              group.tasks.map((task, index) => {
                const overdue = !task.completed && (daysUntil(task.due_date) ?? 1) < 0;
                return (
                  <Pressable
                    key={task.id}
                    onLongPress={() => confirmDelete(task)}
                    style={[styles.taskRow, index > 0 && styles.divided]}
                  >
                    <Checkbox
                      checked={task.completed}
                      accessibilityLabel={`Mark ${task.title} complete`}
                      onToggle={() =>
                        toggleTask.mutate({ id: task.id, completed: !task.completed })
                      }
                    />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.taskTitle,
                          task.completed && {
                            textDecorationLine: "line-through",
                            color: colors.muted,
                          },
                        ]}
                      >
                        {task.title}
                      </Text>
                      {task.notes ? <Text style={styles.meta}>{task.notes}</Text> : null}
                      {task.due_date ? (
                        <Text style={[styles.meta, overdue && { color: colors.roseInk }]}>
                          {overdue ? "Overdue — " : ""}
                          {formatDate(task.due_date)}
                        </Text>
                      ) : null}
                    </View>
                  </Pressable>
                );
              })
            )}
          </Card>
        ))
      )}

      <Text style={styles.hint}>Long-press a task to remove it.</Text>

      <FormSheet
        visible={sheetOpen}
        title="Add a task"
        description="Tasks sit inside a phase of the timeline, counted back from your wedding date."
        submitLabel="Add task"
        isPending={createTask.isPending}
        onSubmit={submitTask}
        onClose={() => setSheetOpen(false)}
      >
        <TextField
          label="Task"
          value={title}
          onChangeText={setTitle}
          placeholder="Book the string quartet"
        />
        <SelectField
          label="Phase"
          value={phase}
          onChange={setPhase}
          options={TIMELINE_PHASES.map((item) => ({ value: item.value, label: item.label }))}
        />
        <TextField
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
        />
      </FormSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  progressLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    letterSpacing: 0.8,
    color: colors.muted,
  },
  progressValue: { fontFamily: fonts.serif, fontSize: 32, color: colors.ink, marginTop: 4 },
  percent: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.sageInk,
    textAlign: "right",
    marginTop: 8,
  },
  meta: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted, marginTop: 3, lineHeight: 17 },

  tabs: { flexDirection: "row", gap: 4, padding: 4, borderRadius: 10, backgroundColor: "#f0ebe4" },
  tab: { flex: 1, paddingVertical: 9, borderRadius: 7, alignItems: "center" },
  tabActive: { backgroundColor: colors.card },
  tabText: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.muted },
  tabTextActive: { color: colors.ink },

  groupHead: { flexDirection: "row", gap: 12, alignItems: "flex-start", marginBottom: 6 },
  groupTitle: { fontFamily: fonts.serif, fontSize: 19, color: colors.ink },
  count: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.muted,
    backgroundColor: colors.neutralTint,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: "hidden",
  },

  taskRow: { flexDirection: "row", gap: 12, paddingVertical: 12 },
  divided: { borderTopWidth: 1, borderTopColor: colors.border },
  taskTitle: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.ink },

  hint: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted, textAlign: "center" },
});
