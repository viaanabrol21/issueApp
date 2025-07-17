// src/navigation/Navigation.tsx

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import IssueRegisterScreen from "../screens/IssueRegisterScreen";
import AddIssueScreen from "../screens/AddIssueScreen";
import IssueDetailScreen from "../screens/IssueDetailScreen";

export type RootStackParamList = {
  Home: undefined;
  AddIssue: { entry?: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={IssueRegisterScreen}
        options={{ title: "Issue Register" }}
      />
      <Stack.Screen
        name="AddIssue"
        component={AddIssueScreen}
        options={({ route }) => ({
          title: route.params?.entry ? "Edit Issue" : "Add Issue",
        })}
      />
      <Stack.Screen
        name="IssueDetail"
        component={IssueDetailScreen}
        options={{ title: "Issue Details" }}
        />
    </Stack.Navigator>
  );
};

export default Navigation;
