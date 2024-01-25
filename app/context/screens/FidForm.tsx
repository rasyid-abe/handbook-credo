import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  StyleSheet,
  ScrollView,
  Button,
  Pressable,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ImagePicker, Album, Asset } from "expo-image-multiple-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { API_URL, TOKEN_KEY, USER_DATA, useAuth } from "../AuthContext";
import * as SecureStore from "expo-secure-store";
import { ToastAndroid } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
const { width } = Dimensions.get("window");

const FidForm = ({ navigation, route }: any) => {
  const [datas, setDatas] = useState([]);
  const [valPrediction, setValPrediction] = useState("");
  const [valReason, setValReason] = useState("");
  const [idFid, setIdFid] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [fillFid, setFillFid] = useState(false);

  const types = route.params?.type;

  let date = new Date();
  const years = [];
  for (let i = date.getFullYear(); i < date.getFullYear() + 10; i++) {
    years.push(i);
  }

  let months = [];
  for (let i = 1; i <= 12; i++) {
    months.push(i < 10 ? "0" + i : i);
  }

  let end = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(); // end date of month
  var days = [];

  for (let i = 1; i <= end; i++) {
    days.push(i < 10 ? "0" + i : i);
  }

  let hours = [];
  for (let i = 0; i < 24; i++) {
    hours.push(i < 10 ? "0" + i : i);
  }

  let minutes = [];
  for (let i = 0; i < 60; i++) {
    minutes.push(i < 10 ? "0" + i : i);
  }

  const prediciton = ["Complete", "Not Complete"];

  const loadData = async () => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);

    let params = { id: route.params?.id };
    fetch(`${API_URL}api/fid_detail?${new URLSearchParams(params)}`, {
      headers: {
        Authorization: `${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setFillFid(res.data.prediction_chm != null ? true : false)
        if (types == 'sales') {
          setFillFid(res.data.prediction_sales != null ? true : false)
        }
        setDatas(res.data);
        setIdFid(res.data.id);
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const sendData = async () => {
    if (year == "") {
      ToastAndroid.show("Field year is required!", ToastAndroid.SHORT);
      return false;
    }
    if (month == "") {
      ToastAndroid.show("Field month is required!", ToastAndroid.SHORT);
      return false;
    }
    if (day == "") {
      ToastAndroid.show("Field day is required!", ToastAndroid.SHORT);
      return false;
    }
    if (hour == "") {
      ToastAndroid.show("Field hour is required!", ToastAndroid.SHORT);
      return false;
    }
    if (minute == "") {
      ToastAndroid.show("Field minute is required!", ToastAndroid.SHORT);
      return false;
    }
    if (valPrediction == "") {
      ToastAndroid.show("Field prediction is required!", ToastAndroid.SHORT);
      return false;
    }

    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    const uinfo = await SecureStore.getItemAsync(USER_DATA);

    const nikp = JSON.parse(uinfo);

    const formData = new FormData();
    formData.append("nik", nikp.nik);
    formData.append("dodate", `${year}-${month}-${day} ${hour}:${minute}:00`);
    formData.append("prediction", valPrediction);
    formData.append("reason", valReason);
    formData.append("id", idFid);
    formData.append("type", types);

    await fetch(`${API_URL}api/save_fid`, {
      method: "POST",
      headers: {
        Accept: "application/x-www-form-urlencoded",
        Authorization: `${token}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("success");
        console.log(res.data);
        setYear("");
        setMonth("");
        setDay("");
        setHour("");
        setMinute("");
        setValPrediction("");
        setValReason("");

        ToastAndroid.show(res.message, ToastAndroid.SHORT);
        navigation.navigate("Fid");
      })
      .catch((err) => {
        console.log("failed");
        console.log(err);
      });

    return true;
  };

  const FillFid = () => {
    return (
      <View>
        <Text style={{ fontWeight: "bold", marginTop: 10 }}>Feedback</Text>
        <View
            style={{
              backgroundColor: "#fff",
              padding: 5,
              borderRadius: 10,
              borderWidth: 1,
            }}
          >
            <View
              style={{
                padding: 5,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Do Date: </Text>
              <Text>{datas["do_date_"+types]}</Text>
            </View>
            <View
              style={{
                padding: 5,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Prediction: </Text>
              <Text>{datas["prediction_"+types]}</Text>
            </View>
            <View
              style={{
                padding: 5,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Reason: </Text>
              <Text>{datas["reason_"+types]}</Text>
            </View>
          </View>
      </View>
    )
  }

  return (
    <SafeAreaView>
      <View
        style={{
          width: "100%",
          height: 60,
          backgroundColor: "#2a4fa3",
          paddingTop: 10,
          borderBottomLeftRadius: 30,
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={25} color="#fff" />
          </TouchableOpacity>
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "#fff" }}>
            {datas["branch_name"]}
          </Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={{ fontWeight: "bold" }}>Header Data</Text>

          <View
            style={{
              backgroundColor: "#fff",
              padding: 5,
              borderRadius: 10,
              borderWidth: 1,
            }}
          >
            <View
              style={{
                padding: 5,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Contract No: </Text>
              <Text>{datas["contract_no"]}</Text>
            </View>
            <View
              style={{
                padding: 5,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Customer Name: </Text>
              <Text>{datas["customer_name"]}</Text>
            </View>
            <View
              style={{
                padding: 5,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Address: </Text>
              <Text>{datas["address"]}</Text>
            </View>
            <View
              style={{
                padding: 5,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Principal Ammount: </Text>
              <Text>
                {new Intl.NumberFormat("id-ID").format(
                  datas["principal_ammount"]
                )}
              </Text>
            </View>
            <View
              style={{
                padding: 5,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Status: </Text>
              <Text>{datas["status_fid"]}</Text>
            </View>
          </View>

          {fillFid ? <FillFid /> : 
            <View>
              <Text style={{ fontWeight: "bold", marginTop: 20 }}>Do Date</Text>
        <View style={{ flexDirection: "row" }}>
          <SelectDropdown
            data={years}
            onSelect={(selectedItem, index) => {
              setYear(selectedItem);
              console.log(selectedItem, index);
            }}
            defaultButtonText={"Year"}
            buttonStyle={styles.btnStyle}
            buttonTextStyle={{ fontSize: 14 }}
            renderDropdownIcon={(isOpened) => {
              return (
                <Ionicons
                  name={isOpened ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="gray"
                />
              );
            }}
            dropdownIconPosition={"right"}
            rowStyle={styles.dropDownRow}
            rowTextStyle={styles.rowText}
          />

          <View style={styles.divider} />

          <SelectDropdown
            data={months}
            onSelect={(selectedItem, index) => {
              setMonth(selectedItem);
              console.log(selectedItem, index);
            }}
            defaultButtonText={"Month"}
            buttonStyle={styles.btnStyle}
            buttonTextStyle={{ fontSize: 14 }}
            renderDropdownIcon={(isOpened) => {
              return (
                <Ionicons
                  name={isOpened ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="gray"
                />
              );
            }}
            dropdownIconPosition={"right"}
            rowStyle={styles.dropDownRow}
            rowTextStyle={styles.rowText}
          />

          <View style={styles.divider} />

          <SelectDropdown
            data={days}
            onSelect={(selectedItem, index) => {
              setDay(selectedItem);
              console.log(selectedItem, index);
            }}
            defaultButtonText={"Day"}
            buttonStyle={styles.btnStyle}
            buttonTextStyle={{ fontSize: 14 }}
            renderDropdownIcon={(isOpened) => {
              return (
                <Ionicons
                  name={isOpened ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="gray"
                />
              );
            }}
            dropdownIconPosition={"right"}
            rowStyle={styles.dropDownRow}
            rowTextStyle={styles.rowText}
          />
        </View>
        <View style={{ flexDirection: "row", marginTop: 5 }}>
          <SelectDropdown
            data={hours}
            onSelect={(selectedItem, index) => {
              setHour(selectedItem);
              console.log(selectedItem, index);
            }}
            defaultButtonText={"Hour"}
            buttonStyle={styles.btnStyle}
            buttonTextStyle={{ fontSize: 14 }}
            renderDropdownIcon={(isOpened) => {
              return (
                <Ionicons
                  name={isOpened ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="gray"
                />
              );
            }}
            dropdownIconPosition={"right"}
            rowStyle={styles.dropDownRow}
            rowTextStyle={styles.rowText}
          />

          <View style={styles.divider} />

          <SelectDropdown
            data={minutes}
            onSelect={(selectedItem, index) => {
              setMinute(selectedItem);
              console.log(selectedItem, index);
            }}
            defaultButtonText={"Minute"}
            buttonStyle={styles.btnStyle}
            buttonTextStyle={{ fontSize: 14 }}
            renderDropdownIcon={(isOpened) => {
              return (
                <Ionicons
                  name={isOpened ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="gray"
                />
              );
            }}
            dropdownIconPosition={"right"}
            rowStyle={styles.dropDownRow}
            rowTextStyle={styles.rowText}
          />
        </View>

        <Text style={{ fontWeight: "bold", marginTop: 10 }}>Prediction</Text>
        <View style={{ flexDirection: "row" }}>
          <SelectDropdown
            data={prediciton}
            onSelect={(selectedItem, index) => {
              setValPrediction(selectedItem);
              console.log(selectedItem, index);
            }}
            defaultButtonText={"Prediction"}
            buttonStyle={styles.btnStylePre}
            buttonTextStyle={{ fontSize: 14 }}
            renderDropdownIcon={(isOpened) => {
              return (
                <Ionicons
                  name={isOpened ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="gray"
                />
              );
            }}
            dropdownIconPosition={"right"}
            rowStyle={styles.dropDownRow}
            rowTextStyle={styles.rowText}
          />
        </View>

        <Text style={{ fontWeight: "bold" }}>Reason</Text>
        <TextInput
          multiline={true}
          numberOfLines={3}
          placeholder="Description"
          style={styles.textarea}
          onChangeText={(text: string) => setValReason(text)}
          value={valReason}
        />

        <TouchableOpacity
          style={{
            width: "100%",
            height: 60,
            backgroundColor: "#2a4fa3",
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
          }}
          onPress={() => sendData()}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
            Submit
          </Text>
        </TouchableOpacity>
            </View>
          }

          <View style={{ height: 150 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default FidForm;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    marginBottom: 12,
    borderRadius: 5,
    backgroundColor: "#fff",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  textarea: {
    borderWidth: 1,
    marginBottom: 12,
    borderRadius: 5,
    backgroundColor: "#fff",
    height: 80,
    textAlignVertical: "top",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  divider: { width: 10 },
  btnStylePre: {
    backgroundColor: "#fff",
    borderWidth: 1,
    flex: 1,
    borderRadius: 5,
    height: 40,
    marginBottom: 10,
  },
  btnStyle: {
    backgroundColor: "#fff",
    borderWidth: 1,
    flex: 1,
    borderRadius: 5,
    height: 30,
  },
  rowText: { textAlign: "center", fontSize: 14 },
  dropDownRow: { height: 40 },
});
