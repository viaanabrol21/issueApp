import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  TextInput,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRegister } from "../context/RegisterContext";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const IssueRegisterScreen = () => {
  const navigation = useNavigation();
  const { entries, deleteEntry } = useRegister();
  const issues = entries.filter((e) => e.type === "issues");

  const [search, setSearch] = useState("");

  const filteredIssues = issues.filter(
    (entry) =>
      entry.title.toLowerCase().includes(search.toLowerCase()) ||
      entry.owner?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    Alert.alert("Confirm", "Are you sure you want to delete this issue?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => {
          deleteEntry(id);
          Toast.show({
            type: "success",
            text1: "Issue deleted successfully",
          });
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Issue Register</Text>

      <TextInput
        placeholder="Search by title or owner..."
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredIssues.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="emoticon-sad-outline" size={42} color="#BDBDBD" />
            <Text style={styles.emptyText}>No issues found.</Text>
          </View>
        ) : (
          filteredIssues.map((entry) => (
            <Pressable
              key={entry.id}
              style={({ pressed }) => [
                styles.card,
                pressed && { backgroundColor: "#f1f6ff" },
              ]}
              onPress={() => navigation.navigate("IssueDetail", { entry })}
            >
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                {entry.images && entry.images.length > 0 && (
                  <View style={{ flexDirection: "row" }}>
                    {entry.images.slice(0, 2).map((uri) => (
                      <Image
                        key={uri}
                        source={{ uri }}
                        style={styles.imageThumb}
                        resizeMode="cover"
                      />
                    ))}
                    {entry.images.length > 2 && (
                      <View style={styles.imageCount}>
                        <Text style={{ color: "#fff", fontWeight: "bold" }}>
                          +{entry.images.length - 2}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
                <Text style={styles.title} numberOfLines={1}>{entry.title}</Text>
              </View>
              <Text style={styles.owner}>
                Owner: <Text style={{ color: "#2563eb" }}>{entry.owner}</Text>
              </Text>
              <Text style={styles.date}>
                Due: {entry.dueDate ? new Date(entry.dueDate).toLocaleDateString() : "-"}
              </Text>
              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("AddIssue", { entry })}
                  style={styles.editButton}
                >
                  <Icon name="pencil" color="#fff" size={18} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(entry.id!)}
                  style={styles.deleteButton}
                >
                  <Icon name="trash-can-outline" color="#fff" size={18} />
                </TouchableOpacity>
              </View>
            </Pressable>
          ))
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddIssue")}
        >
          <Icon name="plus-circle" color="#fff" size={22} />
          <Text style={styles.addButtonText}>Add Issue</Text>
        </TouchableOpacity>
      </ScrollView>
      <Toast />
    </View>
  );
};

export default IssueRegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingTop: 50,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#144288",
    letterSpacing: 1,
  },
  searchInput: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  scrollContent: {
    padding: 20,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    opacity: 0.8,
  },
  emptyText: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 17,
    marginTop: 6,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    transition: "background-color 0.2s",
  },
  imageThumb: {
    width: 46,
    height: 46,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  imageCount: {
    backgroundColor: "#2563eb",
    height: 46,
    minWidth: 46,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginLeft: 6,
    flex: 1,
    flexShrink: 1,
  },
  owner: {
    fontSize: 15,
    color: "#374151",
    marginBottom: 2,
  },
  date: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
  },
  editButton: {
    padding: 7,
    backgroundColor: "#3B82F6",
    borderRadius: 8,
    marginRight: 7,
  },
  deleteButton: {
    padding: 7,
    backgroundColor: "#EF4444",
    borderRadius: 8,
  },
  addButton: {
    marginTop: 22,
    backgroundColor: "#10B981",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 7,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
