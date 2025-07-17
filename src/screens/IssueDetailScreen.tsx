import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/Navigation";

const IssueDetailScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "IssueDetail">>();
  const { entry } = route.params;

  if (!entry) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No issue details available.</Text>
      </View>
    );
  }

  const renderRow = (label: string, value?: string) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || "-"}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Issue Details</Text>

      {entry.images && entry.images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 20}}>
          {entry.images.map((uri) => (
            <Image
              key={uri}
              source={{ uri }}
              style={styles.image}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      )}

      {renderRow("Title", entry.title)}
      {renderRow("Description", entry.description)}
      {renderRow("Date Identified", entry.dateIdentified)}
      {renderRow("Reported By", entry.reportedBy)}
      {renderRow("Category", entry.category)}
      {renderRow("Probability", entry.probability)}
      {renderRow("Impact", entry.impact)}
      {renderRow("Priority", entry.priority)}
      {renderRow("Owner", entry.owner)}
      {renderRow("Response Strategy", entry.responseStrategy)}
      {renderRow("Action Plan", entry.actionPlan)}
      {renderRow("Planned Completion Date", entry.plannedCompletionDate)}
      {renderRow("Status", entry.status)}
      {renderRow("Change Log", entry.changeLog)}
      {renderRow("Comments", entry.comments)}
      {renderRow("Linked Task/Project", entry.linkedProjectTask)}
      {renderRow("Related Risk ID", entry.relatedRiskId)}
    </ScrollView>
  );
};

export default IssueDetailScreen;

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9FAFB",
    padding: 20,
    paddingBottom: 50,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#111827",
  },
  image: {
    width: screenWidth / 2,
    height: 120,
    borderRadius: 10,
    marginRight: 10,
    alignSelf: "center",
  },
  row: {
    marginBottom: 12,
  },
  label: {
    fontWeight: "600",
    color: "#374151",
    marginBottom: 2,
  },
  value: {
    color: "#4B5563",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 100,
  },
});
