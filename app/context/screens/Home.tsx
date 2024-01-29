import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
import Slider from "../component/Slider";
import Carousel from "../component/Carousel";
import GroupDocument from "../component/GroupDocument";
import { API_URL, USER_DATA, TOKEN_KEY, useAuth } from "../AuthContext";
import * as SecureStore from "expo-secure-store";
// import Carousel from "react-native-snap-carousel";

const datas = [
  {
    id: 1,
    content: [
      {
        title: "Spider-Man",
        icon: "construct",
        id: "1",
      },
      {
        title: "Battlefield 2042",
        icon: "gift",
        id: "2",
      },
      {
        title: "Spider-Man: Miles Morales",
        icon: "qr-code",
        id: "3",
      },
    ],
  },
  {
    id: 2,
    content: [
      {
        title: "Halo Infinite",
        icon: "library",
        id: "4",
      },
      {
        title: "Far Cry 6",
        icon: "newspaper",
        id: "5",
      },
      {
        title: "God of War: Ragnarok",
        icon: "school",
        id: "6",
      },
    ],
  },
];

const ShowFid = ({ onPress }: any) => {
  return (
    <SafeAreaView style={{ marginTop: -25 }}>
      <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Feedback FID</Text>
      </View>

      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <TouchableOpacity
          style={{
            width: "100%",
            height: 50,
            backgroundColor: "#2a4fa3",
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={onPress}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "white" }}>
            Data FID
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const Home = ({ navigation, route }: any) => {
  const { authState, onLogin, onLogout } = useAuth();
  const [result, setResult] = useState([]);
  const [slide, setSlide] = useState([]);
  const [looks, setLooks] = useState("");
  const [userData, setUserData] = useState([]);
  const [shFid, setShFid] = useState(false);
  const [notif, setNotif] = useState(0)

  const loadData = async () => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    const uinfo = await SecureStore.getItemAsync(USER_DATA);

    const nikp = JSON.parse(uinfo);
    setUserData(JSON.parse(uinfo));

    let params = { nik: nikp.nik };

    fetch(`${API_URL}api/home?${new URLSearchParams(params)}`, {
      headers: {
        Authorization: `${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (
          res.message == "Invalid Token!" ||
          res.message == "Invalid request!"
        ) {
          onLogout();
        }
        console.log(res.data.notif);
        
        setNotif(res.data.notif)
        setShFid(res.data.showfid);
        setSlide(res.data.slide);
        setResult(res.data.group);
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  };

  const searchFunc = () => {
    navigation.navigate("Search", { key: looks });
    setLooks("");
  };

  useEffect(() => {
    loadData();
  }, [route]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={"#2a4fa3"} barStyle="light-content" />
      <View
        style={{
          width: "100%",
          height: 150,
          backgroundColor: "#2a4fa3",
          paddingTop: 10,
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <View>
            <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
              Hi. {userData.fullname}
            </Text>
            <Text style={{ color: "#fff", gap: 8 }}>
              Let's explore this application
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
              <View
                style={{
                  position: 'relative',
                  marginVertical: 6,
                  marginHorizontal: 10,
                }}
              >
                <Ionicons name="notifications" size={30} color="white" />
                {notif > 0 ? 
                  <View
                    style={{
                      width: 15,
                      height: 15,
                      borderRadius: 7,
                      backgroundColor: "red",
                      position: "absolute",
                      top: 0,
                      right: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  /> : ''
                }
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <Image
                source={{ uri: `${API_URL}assets/profiles/${userData.foto}` }}
                style={{ height: 45, width: 45, borderRadius: 5 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#fff",
              borderRadius: 8,
              paddingRight: 5,
              paddingLeft: 10,
              paddingVertical: 5,
              alignItems: "center",
              height: 45,
            }}
          >
            <TextInput
              placeholder="Search document ..."
              style={{ flex: 1, width: 100 }}
              onSubmitEditing={() => searchFunc()}
              onChangeText={(text: string) => setLooks(text)}
              value={looks}
            />

            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => searchFunc()}
            >
              <Ionicons name="search" size={25} color="gray" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Upcoming Information
          </Text>
          <TouchableOpacity
            style={{
              width: 85,
              height: 25,
              backgroundColor: "#2a4fa3",
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() =>
              navigation.navigate("ListCarousel", { images: slide })
            }
          >
            <Text style={{ color: "#fff", fontSize: 14 }}>View image</Text>
          </TouchableOpacity>
        </View>

        <Carousel images={slide} />
      </View>
      {/* <Slider images={slide} rows={slide.length} /> */}

      {shFid ? <ShowFid onPress={() => navigation.navigate("Fid")} /> : ""}

      <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Document Group</Text>
      </View>

      <ScrollView
        style={{ paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {result.map((item, i) => (
          <GroupDocument key={i} item={item} navigation={navigation} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
