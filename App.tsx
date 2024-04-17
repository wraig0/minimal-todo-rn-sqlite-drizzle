import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite/next";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "./drizzle/migrations";
import {
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { todos } from "./db/schema";
import React, { useCallback } from "react";
import { eq } from "drizzle-orm";

const expoDb = openDatabaseSync("db.db");
const db = drizzle(expoDb);

export default function App() {
  const { success, error } = useMigrations(db, migrations);
  const [text, setText] = React.useState("");
  const [todosList, setTodosList] = React.useState([]);

  const updateTodos = useCallback(() => {
    const newTodos = db
      .select()
      .from(todos)
      .orderBy(todos.createdAt)
      .all()
      .reverse();
    console.log(newTodos);
    setTodosList(newTodos);
  }, []);

  const deleteTodo = useCallback(
    (id: number) => {
      (async () => {
        try {
          await db.delete(todos).where(eq(todos.id, id));
          updateTodos();
        } catch (e) {
          console.error(e);
        }
      })();
    },
    [updateTodos]
  );

  const addTodo = useCallback(() => {
    (async () => {
      if (text === "") return;
      try {
        await db.insert(todos).values({ text });
        updateTodos();
        setText("");
      } catch (e) {
        console.error(e);
      }
    })();
  }, [text, updateTodos]);

  React.useEffect(() => {
    updateTodos();
  }, []);

  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }
  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <View style={styles.form}>
          <TextInput
            autoFocus
            style={styles.input}
            placeholder="Go shopping..."
            value={text}
            onChangeText={setText}
            onSubmitEditing={addTodo}
          />
          <Button title="Add todo" onPress={addTodo} />
        </View>
        {todosList.length > 0 && <Text>Click a Todo to delete it</Text>}
        <FlatList
          style={styles.list}
          data={todosList}
          renderItem={({ item }) => (
            <View style={styles.todoButton}>
              <Button
                title={item.text}
                onPress={() => deleteTodo(item.id)}
                accessibilityLabel="Press to delete this todo"
              />
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingTop: 50,
  },
  input: {
    borderColor: "black",
    borderWidth: 1,
    padding: 4,
  },
  form: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  root: {
    flex: 1,
    padding: 8,
  },
  todoButton: {},
  list: {
    width: "100%",
    flexDirection: "column",
    gap: 8,
  },
});
