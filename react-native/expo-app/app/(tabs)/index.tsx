import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApolloClient, HttpLink, InMemoryCache, gql } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { Limelight } from "@getlimelight/sdk";

Limelight.connect();

const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: "https://rickandmortyapi.com/graphql" }),
  cache: new InMemoryCache(),
});

const queryClient = new QueryClient();

const GET_CHARACTERS = gql`
  query GetCharacters {
    characters {
      results {
        id
        name
        status
      }
    }
  }
`;

const GET_CHARACTER = gql`
  query GetCharacter($id: ID!) {
    character(id: $id) {
      id
      name
      status
      species
    }
  }
`;

const TestScreenContent = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<string>("");

  // ============ FETCH TESTS ============
  const testFetchGet = async () => {
    setLoading("fetch-get");
    console.log("🔵 Starting Fetch GET test");
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts/1"
      );
      const data = await response.json();
      console.log("✅ Fetch GET success:", data);
      setResults(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("❌ Fetch GET error:", error);
      setResults(`Error: ${error}`);
    } finally {
      setLoading(null);
    }
  };

  const testFetchPost = async () => {
    setLoading("fetch-post");
    console.log("🔵 Starting Fetch POST test");
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "Test Post",
            body: "This is a test",
            userId: 1,
          }),
        }
      );
      const data = await response.json();
      console.log("✅ Fetch POST success:", data);
      setResults(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("❌ Fetch POST error:", error);
      setResults(`Error: ${error}`);
    } finally {
      setLoading(null);
    }
  };

  const testFetch404 = async () => {
    setLoading("fetch-404");
    console.warn("⚠️ Testing 404 error");
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts/99999999"
      );
      console.log("Response status:", response.status);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error("❌ Expected 404 error:", error);
      setResults(`Error: ${error}`);
    } finally {
      setLoading(null);
    }
  };

  // ============ AXIOS TESTS ============
  const testAxiosGet = async () => {
    setLoading("axios-get");
    console.log("🔵 Starting Axios GET test");
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users/1"
      );
      console.log("✅ Axios GET success:", response.data);
      setResults(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error("❌ Axios GET error:", error);
      setResults(`Error: ${error}`);
    } finally {
      setLoading(null);
    }
  };

  const testAxiosPost = async () => {
    setLoading("axios-post");
    console.log("🔵 Starting Axios POST test");
    try {
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/posts",
        {
          title: "Axios Test",
          body: "Testing Axios POST",
          userId: 1,
        }
      );
      console.log("✅ Axios POST success:", response.data);
      setResults(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error("❌ Axios POST error:", error);
      setResults(`Error: ${error}`);
    } finally {
      setLoading(null);
    }
  };

  const testAxiosError = async () => {
    setLoading("axios-error");
    console.warn("⚠️ Testing Axios error handling");
    try {
      await axios.get(
        "https://jsonplaceholder.typicode.com/invalid-endpoint-12345"
      );
    } catch (error: any) {
      console.error("❌ Expected Axios error:", error.message);
      setResults(`Error: ${error.message}`);
    } finally {
      setLoading(null);
    }
  };

  // ============ GRAPHQL TESTS ============
  const testGraphQLQuery = async () => {
    setLoading("graphql-query");
    console.log("🔵 Starting GraphQL Query test");
    try {
      const result = await apolloClient.query({
        query: GET_CHARACTERS,
      });
      console.log("✅ GraphQL Query success:", result.data);
      setResults(JSON.stringify(result.data, null, 2));
    } catch (error) {
      console.error("❌ GraphQL Query error:", error);
      setResults(`Error: ${error}`);
    } finally {
      setLoading(null);
    }
  };

  const testGraphQLWithVariables = async () => {
    setLoading("graphql-variables");
    console.log("🔵 Starting GraphQL Query with variables");
    try {
      const result = await apolloClient.query({
        query: GET_CHARACTER,
        variables: { id: "1" },
      });
      console.log("✅ GraphQL with variables success:", result.data);
      setResults(JSON.stringify(result.data, null, 2));
    } catch (error) {
      console.error("❌ GraphQL with variables error:", error);
      setResults(`Error: ${error}`);
    } finally {
      setLoading(null);
    }
  };

  const testPlainTextRequest = async () => {
    setLoading("plaintext-request-1");

    try {
      // Using JSONPlaceholder's plaintext endpoint
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts/1",
        {
          headers: {
            Accept: "text/plain",
          },
        }
      );

      await fetch("https://httpbin.org/robots.txt")
        .then((r) => r.text())
        .then(console.log);

      const text = await response.text();
      console.log("Plain text response:", text);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(null);
    }
  };

  // Or create a simple test endpoint that returns text/plain
  const testCustomPlainText = async () => {
    setLoading("plaintext-request-2");

    try {
      // This should trigger your XHR interceptor
      const response = await fetch(
        "https://httpbin.org/response-headers?Content-Type=text/plain;%20charset=utf-8",
        {
          method: "GET",
        }
      );

      const text = await response.text();
      console.log("Plain text response:", text);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(null);
    }
  };

  // Common pattern that would trigger this
  const uploadImage = async () => {
    setLoading("image-request");

    try {
      // First, fetch an image as blob
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "https://picsum.photos/200/300");
      xhr.responseType = "blob";

      xhr.onload = function () {
        if (xhr.status === 200) {
          console.log("Got blob:", xhr.response);
          // This should crash your current interceptor
        }
      };

      xhr.onerror = function () {
        console.error("XHR Error");
      };

      xhr.send();
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(null);
    }
  };

  // ============ CONSOLE TESTS ============
  const testConsoleLogs = () => {
    console.info("Info: Application started successfully");
    console.warn("Warning: Low disk space");
    console.error("Exception: Undefined is not a function");
    console.debug("exception: Wrote 5 entries to database.");
    console.error("https://ui.shadcn.com/docs/components/alert-dialog");
    setResults("Sent various console logs - check console tab");
  };

  const testConsoleObjects = () => {
    console.log("User:", {
      name: "John",
      age: 30,
      nested: { value: 123 },
    });
    console.log("Array test:", [1, 2, 3, 4, 5]);
    console.log("Multiple args:", "string", 123, true, null, undefined);
    setResults("Sent object/array console logs - check console tab");
  };

  const testConsoleErrors = () => {
    try {
      throw new Error("exception: Wrote 5 entries to database.");
    } catch (error) {
      console.error("Caught exception:", error);
    }
    console.error("Error: Network request failed");
    console.error("Exception: Undefined is not a function");
    setResults("Sent error console logs - check console tab");
  };

  const testPerformanceLogs = () => {
    console.log("Performance: Render took 245ms");
    console.warn("Performance: Slow component detected");
    console.log("FPS dropped to 45");
    console.log("Memory usage: 125MB");
    setResults("Sent performance logs - check console tab");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Limelight Test Screen</Text>

      {/* FETCH TESTS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fetch API Tests</Text>
        <TestButton
          title="Fetch GET"
          onPress={testFetchGet}
          loading={loading === "fetch-get"}
        />
        <TestButton
          title="Fetch POST"
          onPress={testFetchPost}
          loading={loading === "fetch-post"}
        />
        <TestButton
          title="Fetch 404 Error"
          onPress={testFetch404}
          loading={loading === "fetch-404"}
        />
      </View>

      {/* AXIOS TESTS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Axios Tests</Text>
        <TestButton
          title="Axios GET"
          onPress={testAxiosGet}
          loading={loading === "axios-get"}
        />
        <TestButton
          title="Axios POST"
          onPress={testAxiosPost}
          loading={loading === "axios-post"}
        />
        <TestButton
          title="Axios Error"
          onPress={testAxiosError}
          loading={loading === "axios-error"}
        />
      </View>

      {/* text/plain; charset=utf-8 TESTS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Plain Text Tests</Text>
        <TestButton
          title="Plain Text Request"
          onPress={testPlainTextRequest}
          loading={loading === "plaintext-request-1"}
        />
        <TestButton
          title="Plain Text Request"
          onPress={testCustomPlainText}
          loading={loading === "plaintext-request-2"}
        />
      </View>

      {/* GRAPHQL TESTS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>GraphQL Tests</Text>
        <TestButton
          title="GraphQL Query"
          onPress={testGraphQLQuery}
          loading={loading === "graphql-query"}
        />
        <TestButton
          title="GraphQL with Variables"
          onPress={testGraphQLWithVariables}
          loading={loading === "graphql-variables"}
        />
      </View>

      {/* Blob tests*/}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Blob test</Text>
        <TestButton
          title="Fetch Image as Blob"
          onPress={uploadImage}
          loading={loading === "graphql-query"}
        />
      </View>

      {/* CONSOLE TESTS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Console Tests</Text>
        <TestButton title="Basic Console Logs" onPress={testConsoleLogs} />
        <TestButton title="Objects & Arrays" onPress={testConsoleObjects} />
        <TestButton title="Error Messages" onPress={testConsoleErrors} />
        <TestButton title="Performance Logs" onPress={testPerformanceLogs} />
      </View>

      {/* RESULTS */}
      {results ? (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Last Result:</Text>
          <Text style={styles.resultsText}>{results}</Text>
        </View>
      ) : null}

      <View style={{ height: 50 }} />
    </ScrollView>
  );
};

export const TestButton = ({
  title,
  onPress,
  loading = false,
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
}) => (
  <TouchableOpacity style={styles.button} onPress={onPress} disabled={loading}>
    {loading ? (
      <ActivityIndicator color="#fff" />
    ) : (
      <Text style={styles.buttonText}>{title}</Text>
    )}
  </TouchableOpacity>
);

// Wrap with providers
export const LimelightTestScreen = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>
        <TestScreenContent />
      </QueryClientProvider>
    </ApolloProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 40,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  resultsContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  resultsText: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#666",
  },
});

export default LimelightTestScreen;
