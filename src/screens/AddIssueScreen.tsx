import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { launchImageLibrary } from "react-native-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRegister } from "../context/RegisterContext";
import { useNavigation, useRoute } from "@react-navigation/native";

const priorities = ["Low", "Medium", "High", "Critical"];
const statuses = [
  "Open",
  "In Progress",
  "Resolved",
  "Closed",
  "Deferred",
  "Reopened",
];
const probabilities = ["Low", "Medium", "High", "Certain"];
const impacts = ["Low", "Medium", "High", "Extreme"];
const categories = [
  "Technical",
  "Process",
  "Resource",
  "External",
  "Other",
];
const responseStrategies = [
  "Mitigate",
  "Accept",
  "Transfer",
  "Avoid",
  "Escalate",
];
const owners = ["Unassigned", "Aman", "Team", "Other"];

const initialState = {
  title: "",
  description: "",
  dueDate: "",
  dateIdentified: new Date().toISOString(),
  reportedBy: "",
  category: "",
  probability: "",
  impact: "",
  priority: "",
  owner: "",
  responseStrategy: "",
  actionPlan: "",
  plannedCompletionDate: new Date().toISOString(),
  status: "",
  changeLog: "",
  comments: "",
  linkedProjectTask: "",
  relatedRiskId: "",
  images: [],
};

const AddIssueScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { addOrUpdateEntry } = useRegister();
  const paramEntry = route.params?.entry;

  const [form, setForm] = useState(initialState);
  const [showDateIdentified, setShowDateIdentified] = useState(false);
  const [showPlannedCompletion, setShowPlannedCompletion] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (paramEntry) {
      setForm({
        ...initialState,
        ...paramEntry,
        dateIdentified: paramEntry.dateIdentified || new Date().toISOString(),
        plannedCompletionDate: paramEntry.plannedCompletionDate || new Date().toISOString(),
        images: paramEntry.images || [],
      });
    } else {
      setForm(initialState);
    }
  }, [paramEntry]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Multiple images
  const pickImages = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        selectionLimit: 0, // 0 means unlimited
        quality: 0.7,
      },
      (response) => {
        if (response.didCancel || response.errorCode) return;
        const newImages =
          response.assets?.map((asset) => asset.uri).filter(Boolean) || [];
        setForm((prev) => ({
          ...prev,
          images: [...(prev.images || []), ...newImages],
        }));
      }
    );
  };

  const removeImage = (uri) => {
    setForm((prev) => ({
      ...prev,
      images: (prev.images || []).filter((img) => img !== uri),
    }));
  };

  const validate = () => {
    if (!form.title.trim()) return "Title is required";
    if (!form.description.trim()) return "Description is required";
    if (!form.priority) return "Priority is required";
    if (!form.status) return "Status is required";
    if (!form.owner) return "Owner is required";
    return null;
  };

  const handleSubmit = () => {
    const error = validate();
    if (error) {
      Alert.alert("Validation Error", error);
      return;
    }
    setLoading(true);
    const payload = {
      ...form,
      id: paramEntry?.id, // keep id if editing
      type: "issues",
      images: form.images || [],
    };
    addOrUpdateEntry(payload);
    setLoading(false);
    Alert.alert(
      paramEntry?.id ? "Issue Updated" : "Issue Added",
      undefined,
      [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]
    );
    // No reset here; navigation will unmount
  };

  const onDateIdentifiedChange = (event, selectedDate) => {
    setShowDateIdentified(false);
    if (selectedDate) {
      handleChange("dateIdentified", selectedDate.toISOString());
    }
  };
  const onPlannedCompletionChange = (event, selectedDate) => {
    setShowPlannedCompletion(false);
    if (selectedDate) {
      handleChange("plannedCompletionDate", selectedDate.toISOString());
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>
          {paramEntry?.id ? "Edit Issue" : "Add Issue"}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Title *"
          value={form.title}
          onChangeText={(v) => handleChange("title", v)}
        />
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Description *"
          value={form.description}
          multiline
          onChangeText={(v) => handleChange("description", v)}
        />
        <TouchableOpacity
          onPress={() => setShowDateIdentified(true)}
          style={styles.dateButton}
        >
          <Text style={styles.dateText}>
            Date Identified:{" "}
            {form.dateIdentified
              ? new Date(form.dateIdentified).toDateString()
              : ""}
          </Text>
        </TouchableOpacity>
        {showDateIdentified && (
          <DateTimePicker
            value={
              form.dateIdentified ? new Date(form.dateIdentified) : new Date()
            }
            mode="date"
            display="default"
            onChange={onDateIdentifiedChange}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Due Date (optional)"
          value={form.dueDate}
          onChangeText={(v) => handleChange("dueDate", v)}
        />
        <TextInput
          style={styles.input}
          placeholder="Reporter"
          value={form.reportedBy}
          onChangeText={(v) => handleChange("reportedBy", v)}
        />
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={form.category}
            onValueChange={(v) => handleChange("category", v)}
          >
            <Picker.Item label="Category" value="" />
            {categories.map((c) => (
              <Picker.Item key={c} label={c} value={c} />
            ))}
          </Picker>
        </View>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={form.probability}
            onValueChange={(v) => handleChange("probability", v)}
          >
            <Picker.Item label="Probability" value="" />
            {probabilities.map((c) => (
              <Picker.Item key={c} label={c} value={c} />
            ))}
          </Picker>
        </View>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={form.impact}
            onValueChange={(v) => handleChange("impact", v)}
          >
            <Picker.Item label="Impact" value="" />
            {impacts.map((c) => (
              <Picker.Item key={c} label={c} value={c} />
            ))}
          </Picker>
        </View>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={form.priority}
            onValueChange={(v) => handleChange("priority", v)}
          >
            <Picker.Item label="Priority *" value="" />
            {priorities.map((c) => (
              <Picker.Item key={c} label={c} value={c} />
            ))}
          </Picker>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Owner *"
          value={form.owner}
          onChangeText={(v) => handleChange("owner", v)}
        />

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={form.responseStrategy}
            onValueChange={(v) => handleChange("responseStrategy", v)}
          >
            <Picker.Item label="Response Strategy" value="" />
            {responseStrategies.map((c) => (
              <Picker.Item key={c} label={c} value={c} />
            ))}
          </Picker>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Action Plan"
          value={form.actionPlan}
          onChangeText={(v) => handleChange("actionPlan", v)}
        />
        <TouchableOpacity
          onPress={() => setShowPlannedCompletion(true)}
          style={styles.dateButton}
        >
          <Text style={styles.dateText}>
            Planned Completion:{" "}
            {form.plannedCompletionDate
              ? new Date(form.plannedCompletionDate).toDateString()
              : ""}
          </Text>
        </TouchableOpacity>
        {showPlannedCompletion && (
          <DateTimePicker
            value={
              form.plannedCompletionDate
                ? new Date(form.plannedCompletionDate)
                : new Date()
            }
            mode="date"
            display="default"
            onChange={onPlannedCompletionChange}
          />
        )}
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={form.status}
            onValueChange={(v) => handleChange("status", v)}
          >
            <Picker.Item label="Status *" value="" />
            {statuses.map((c) => (
              <Picker.Item key={c} label={c} value={c} />
            ))}
          </Picker>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Change Log"
          value={form.changeLog}
          onChangeText={(v) => handleChange("changeLog", v)}
        />
        <TextInput
          style={styles.input}
          placeholder="Comments"
          value={form.comments}
          onChangeText={(v) => handleChange("comments", v)}
        />
        <TextInput
          style={styles.input}
          placeholder="Linked Task/Project"
          value={form.linkedProjectTask}
          onChangeText={(v) => handleChange("linkedProjectTask", v)}
        />
        <TextInput
          style={styles.input}
          placeholder="Related Risk ID"
          value={form.relatedRiskId}
          onChangeText={(v) => handleChange("relatedRiskId", v)}
        />

        {/* Attach Images */}
        <TouchableOpacity style={styles.imageButton} onPress={pickImages}>
          <Text style={{ color: "#fff" }}>
            Attach Images ({form.images.length})
          </Text>
        </TouchableOpacity>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(form.images || []).map((uri) =>
            uri ? (
              <View key={uri} style={styles.imagePreviewContainer}>
                <Image source={{ uri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageBtn}
                  onPress={() => removeImage(uri)}
                >
                  <Text style={{ color: "#fff" }}>X</Text>
                </TouchableOpacity>
              </View>
            ) : null
          )}
        </ScrollView>

        {/* Submit */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitText}>
            {paramEntry?.id ? "Update Issue" : "Add Issue"}
          </Text>
        </TouchableOpacity>
        <View style={{ height: 60 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: "#fafbfc",
    flexGrow: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    alignSelf: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d3d8e1",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 14,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#d3d8e1",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 14,
    overflow: "hidden",
  },
  dateButton: {
    backgroundColor: "#e7ecf2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
  },
  dateText: {
    fontSize: 16,
    color: "#111",
  },
  submitButton: {
    backgroundColor: "#115edb",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  imageButton: {
    backgroundColor: "#115edb",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 14,
  },
  imagePreviewContainer: {
    marginRight: 10,
    position: "relative",
    marginBottom: 12,
    width: 72,
    height: 72,
  },
  imagePreview: {
    width: 72,
    height: 72,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#aaa",
  },
  removeImageBtn: {
    position: "absolute",
    top: 3,
    right: 3,
    backgroundColor: "#ff4d4f",
    borderRadius: 11,
    width: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AddIssueScreen;
