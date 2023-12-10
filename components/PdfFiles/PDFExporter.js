"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet } from "react-pdf";

const PDFExporter = ({ data }) => {
  //   const styles = StyleSheet.create({
  //     page: {
  //       flexDirection: "row",
  //       backgroundColor: "#ffffff",
  //     },
  //     container: {
  //       flex: 1,
  //       justifyContent: "center",
  //       alignItems: "center",
  //       marginTop: 50,
  //     },
  //     text: {
  //       marginBottom: 10,
  //     },
  //   });

  return (
    <Document>
      {data.map((item, index) => (
        <Page key={index} size="A4">
          <View>
            <Text>Identifier: {item.identifier}</Text>
            <Text>Vehicle: {item.vehicle}</Text>
            <Text>Code: {item.code}</Text>
            <Text>1: {item["1"]}</Text>
            <Text>2: {item["2"]}</Text>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default PDFExporter;
