import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  Button,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import React, { useState, useEffect } from "react";
import { useNavigation } from "expo-router";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import * as ImagePicker from "expo-image-picker";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import { db, auth, storage } from "../../firebase";
import { colors } from "../../colors";

const Profile = () => {
  const navigation = useNavigation();
  const [username, setUserName] = useState("Username:");
  const [telehandle, setTeleHandle] = useState("Telegram handle:");
  const [eduLevel, setEduLevel] = useState("");
  const [school, setSchool] = useState("");
  const [showSchools, setShowSchools] = useState(false);
  const [strengths, setStrengths] = useState([]);
  const [weaknesses, setWeaknesses] = useState([]);
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const subjects = [
    { key: "0", value: "Computer Science" },
    { key: "1", value: "Mathematics" },
    { key: "2", value: "Economics" },
    { key: "3", value: "Chemistry" },
    { key: "4", value: "Geography" },
    { key: "5", value: "History" },
    { key: "6", value: "Physics" },
    { key: "7", value: "Biology" },
    { key: "8", value: "Literature" },
  ];

  const handleEduLevelChange = (itemValue) => {
    setEduLevel(itemValue);
    if (eduLevel === "") {
      setShowSchools(false);
    } else {
      setShowSchools(true);
    }
  };

  const handleProfileEdit = async () => {
    try {
      const str = strengths
        .reduce((acc, curr) => acc + "\\" + curr, "")
        .slice(1);
      console.log(str);
      const wk = weaknesses
        .reduce((acc, curr) => acc + "\\" + curr, "")
        .slice(1);
      const docRef = doc(db, "users", auth.currentUser.uid);
      const imgRef = ref(storage, auth.currentUser.uid);

      if (!imgRef) {
        deleteObject(imgRef);
      }

      const response = await fetch(image);
      const blob = await response.blob();
      console.log(blob.size);

      if (blob.size < 2500000) {
        await uploadBytes(imgRef, blob).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => (temp = url));
        });

        await new Promise((r) => setTimeout(r, 500));

        await updateDoc(docRef, {
          profile: true,
          school: school,
          tele: telehandle,
          username: username,
          strengths: str,
          weaknesses: wk,
          level: eduLevel,
          image: temp,
        });
        navigation.replace("Home");
      } else {
        alert("File is too large, please upload a file smaller than 2.5mb.");
      }
    } catch (error) {
      console.error(error);
    }
    console.log("nav");
  };

  const getProfile = async () => {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    const d = docSnap.data();
    console.log(d);
    setUserName(d.username);
    setTeleHandle(d.tele);
    setEduLevel(d.level);
    setSchool(d.school);
    setStrengths(d.strengths.split("\\"));
    setWeaknesses(d.weaknesses.split("\\"));
    setImage(d.image);
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container} style={{ flex: 1 }}>
      <Text style={styles.profileHeader}>Update Profile</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Username:"
          defaultValue={username}
          placeholderTextColor="black"
          onChangeText={(text) => {
            setUserName(text);
          }}
          style={[styles.textInput]}
        />

        <TextInput
          placeholder="Telegram Handle:"
          defaultValue={telehandle}
          placeholderTextColor="black"
          onChangeText={(text) => {
            setTeleHandle(text);
          }}
          style={[styles.textInput]}
        />
        <View style={[styles.pickerInput]}>
          <Picker onValueChange={handleEduLevelChange} selectedValue={eduLevel}>
            <Picker.Item label="Select your education level" value="" />
            <Picker.Item label="Secondary" value="Secondary" />
            <Picker.Item label="Junior College" value="Junior College" />
            <Picker.Item label="Polytechnic" value="Polytechnic" />
            <Picker.Item label="University" value="University" />
          </Picker>
        </View>

        <View style={[styles.pickerInput]}>
          {/* {eduLevel !== "Primary" && showSchools && (
            <Picker
              selectedValue={school}
              onValueChange={(itemValue) => setSchool(itemValue)}
            >
              <Picker.Item label="Select your school" value="" />
              <Picker.Item label="Admiralty Primary School" value="Admiralty Primary School"/>
              <Picker.Item label="Ahmad Ibrahim Primary School" value="Ahmad Ibrahim Primary School"/>
              <Picker.Item label="Ai Tong School" value="Ai Tong School"/>
              <Picker.Item label="Alexandra Primary School" value="Alexandra Primary School"/>
              <Picker.Item label="Anchor Green Primary School" value="Anchor Green Primary School"/>
              <Picker.Item label="Anderson Primary School" value="Anderson Primary School"/>
              <Picker.Item label="Anglo-Chinese School (Junior)" value="Anglo-Chinese School (Junior)"/>
              <Picker.Item label="Anglo-Chinese School (Primary)" value="Anglo-Chinese School (Primary)"/>
              <Picker.Item label="Angsana Primary School" value="Angsana Primary School"/>
              <Picker.Item label="Ang Mo Kio Primary School" value="Ang Mo Kio Primary School"/>
              <Picker.Item label="Beacon Primary School" value="Beacon Primary School"/>
              <Picker.Item label="Bedok Green Primary School" value="Bedok Green Primary School"/>
              <Picker.Item label="Bendemeer Primary School" value="Bendemeer Primary School"/>
              <Picker.Item label="Blangah Rise Primary School" value="Blangah Rise Primary School"/>
              <Picker.Item label="Boon Lay Garden Primary School" value="Boon Lay Garden Primary School"/>
              <Picker.Item label="Bukit Panjang Primary School" value="Bukit Panjang Primary School"/>
              <Picker.Item label="Bukit Timah Primary School" value="Bukit Timah Primary School"/>
              <Picker.Item label="Bukit View Primary School" value="Bukit View Primary School"/>
              <Picker.Item label="Canberra Primary School" value="Canberra Primary School"/>
              <Picker.Item label="Canossa Catholic Primary School" value="Canossa Catholic Primary School"/>
              <Picker.Item label="Cantonment Primary School" value="Cantonment Primary School"/>
              <Picker.Item label="Casuarina Primary School" value="Casuarina Primary School"/>
              <Picker.Item label="Catholic High School (Primary)" value="Catholic High School (Primary)"/>
              <Picker.Item label="Cedar Primary School" value="Cedar Primary School"/>
              <Picker.Item label="Changkat Primary School" value="Changkat Primary School"/>
              <Picker.Item label="CHIJ (Katong) Primary" value="CHIJ (Katong) Primary"/>
              <Picker.Item label="CHIJ (Kellock)" value="CHIJ (Kellock)"/>
              <Picker.Item label="CHIJ Our Lady of Good Counsel" value="CHIJ Our Lady of Good Counsel"/>
              <Picker.Item label="CHIJ Our Lady of the Nativity" value="CHIJ Our Lady of the Nativity"/>
              <Picker.Item label="CHIJ Our Lady Queen of Peace" value="CHIJ Our Lady Queen of Peace"/>
              <Picker.Item label="CHIJ Primary (Toa Payoh)" value="CHIJ Primary (Toa Payoh)"/>
              <Picker.Item label="CHIJ St. Nicholas Girls' School (Primary Section)" value="CHIJ St. Nicholas Girls' School (Primary Section)"/>
              <Picker.Item label="Chongfu School" value="Chongfu School"/>
              <Picker.Item label="Chongzheng Primary School" value="Chongzheng Primary School"/>
              <Picker.Item label="Chua Chu Kang Primary School" value="Chua Chu Kang Primary School"/>
              <Picker.Item label="Clementi Primary School" value="Clementi Primary School"/>
              <Picker.Item label="Compassvale Primary School" value="Compassvale Primary School"/>
              <Picker.Item label="Concord Primary School" value="Concord Primary School"/>
              <Picker.Item label="Coral Primary School" value="Coral Primary School"/>
              <Picker.Item label="Corporation Primary School" value="Corporation Primary School"/>
              <Picker.Item label="Da Qiao Primary School" value="Da Qiao Primary School"/>
              <Picker.Item label="Damai Primary School" value="Damai Primary School"/>
              <Picker.Item label="Dazhong Primary School" value="Dazhong Primary School"/>
              <Picker.Item label="De La Salle School" value="De La Salle School"/>
              <Picker.Item label="East Coast Primary School" value="East Coast Primary School"/>
              <Picker.Item label="East Spring Primary School" value="East Spring Primary School"/>
              <Picker.Item label="East View Primary School" value="East View Primary School"/>
              <Picker.Item label="Edgefield Primary School" value="Edgefield Primary School"/>
              <Picker.Item label="Elias Park Primary School" value="Elias Park Primary School"/>
              <Picker.Item label="Endeavour Primary School" value="Endeavour Primary School"/>
              <Picker.Item label="Evergreen Primary School" value="Evergreen Primary School"/>
              <Picker.Item label="Fairfield Methodist School (Primary)" value="Fairfield Methodist School (Primary)"/>
              <Picker.Item label="Farrer Park Primary School" value="Farrer Park Primary School"/>
              <Picker.Item label="Fengshan Primary School" value="Fengshan Primary School"/>
              <Picker.Item label="Fernvale Primary School" value="Fernvale Primary School"/>
              <Picker.Item label="First Toa Payoh Primary School" value="First Toa Payoh Primary School"/>
              <Picker.Item label="Frontier Primary School" value="Frontier Primary School"/>
              <Picker.Item label="Fuchun Primary School" value="Fuchun Primary School"/>
              <Picker.Item label="Fuhua Primary School" value="Fuhua Primary School"/>
              <Picker.Item label="Gan Eng Seng Primary School" value="Gan Eng Seng Primary School"/>
              <Picker.Item label="Geylang Methodist School (Primary)" value="Geylang Methodist School (Primary)"/>
              <Picker.Item label="Gongshang Primary School" value="Gongshang Primary School"/>
              <Picker.Item label="Greendale Primary School" value="Greendale Primary School"/>
              <Picker.Item label="Greenridge Primary School" value="Greenridge Primary School"/>
              <Picker.Item label="Greenwood Primary School" value="Greenwood Primary School"/>
              <Picker.Item label="Haig Girls' School" value="Haig Girls' School"/>
              <Picker.Item label="Holy Innocents' Primary School" value="Holy Innocents' Primary School"/>
              <Picker.Item label="Henry Park Primary School" value="Henry Park Primary School"/>
              <Picker.Item label="Hong Wen School" value="Hong Wen School"/>
              <Picker.Item label="Horizon Primary School" value="Horizon Primary School"/>
              <Picker.Item label="Hougang Primary School" value="Hougang Primary School"/>
              <Picker.Item label="Huamin Primary School" value="Huamin Primary School"/>
              <Picker.Item label="Innova Primary School" value="Innova Primary School"/>
              <Picker.Item label="Jiemin Primary School" value="Jiemin Primary School"/>
              <Picker.Item label="Jing Shan Primary School [zh]" value="Jing Shan Primary School [zh]"/>
              <Picker.Item label="Junyuan Primary School" value="Junyuan Primary School"/>
              <Picker.Item label="Jurong Primary School" value="Jurong Primary School"/>
              <Picker.Item label="Jurong West Primary School" value="Jurong West Primary School"/>
              <Picker.Item label="Juying Primary School" value="Juying Primary School"/>
              <Picker.Item label="Keming Primary School" value="Keming Primary School"/>
              <Picker.Item label="Kheng Cheng School" value="Kheng Cheng School"/>
              <Picker.Item label="Kong Hwa School" value="Kong Hwa School"/>
              <Picker.Item label="Kranji Primary School" value="Kranji Primary School"/>
              <Picker.Item label="Kuo Chuan Presbyterian Primary School" value="Kuo Chuan Presbyterian Primary School"/>
              <Picker.Item label="Lakeside Primary School" value="Lakeside Primary School"/>
              <Picker.Item label="Lianhua Primary School" value="Lianhua Primary School"/>
              <Picker.Item label="Maha Bodhi School" value="Maha Bodhi School"/>
              <Picker.Item label="Maris Stella High School (Primary Section)" value="Maris Stella High School (Primary Section)"/>
              <Picker.Item label="Marsiling Primary School" value="Marsiling Primary School"/>
              <Picker.Item label="Marymount Convent School" value="Marymount Convent School"/>
              <Picker.Item label="Mayflower Primary School" value="Mayflower Primary School"/>
              <Picker.Item label="Mee Toh School" value="Mee Toh School"/>
              <Picker.Item label="Meridian Primary School" value="Meridian Primary School"/>
              <Picker.Item label="Methodist Girls' School (Primary)" value="Methodist Girls' School (Primary)"/>
              <Picker.Item label="Montfort Junior School" value="Montfort Junior School"/>
              <Picker.Item label="Nan Chiau Primary School" value="Nan Chiau Primary School"/>
              <Picker.Item label="Nan Hua Primary School" value="Nan Hua Primary School"/>
              <Picker.Item label="Nanyang Primary School" value="Nanyang Primary School"/>
              <Picker.Item label="Ngee Ann Primary School" value="Ngee Ann Primary School"/>
              <Picker.Item label="Naval Base Primary School" value="Naval Base Primary School"/>
              <Picker.Item label="New Town Primary School" value="New Town Primary School"/>
              <Picker.Item label="Northland Primary School" value="Northland Primary School"/>
              <Picker.Item label="Northoaks Primary School" value="Northoaks Primary School"/>
              <Picker.Item label="North Spring Primary School" value="North Spring Primary School"/>
              <Picker.Item label="North View Primary School" value="North View Primary School"/>
              <Picker.Item label="North Vista Primary School" value="North Vista Primary School"/>
              <Picker.Item label="Oasis Primary School" value="Oasis Primary School"/>
              <Picker.Item label="Opera Estate Primary School" value="Opera Estate Primary School"/>
              <Picker.Item label="Palm View Primary School" value="Palm View Primary School"/>
              <Picker.Item label="Park View Primary School" value="Park View Primary School"/>
              <Picker.Item label="Pasir Ris Primary School" value="Pasir Ris Primary School"/>
              <Picker.Item label="Paya Lebar Methodist Girls' School (Primary)" value="Paya Lebar Methodist Girls' School (Primary)"/>
              <Picker.Item label="Pei Chun Public School" value="Pei Chun Public School"/>
              <Picker.Item label="Pei Hwa Presbyterian Primary School" value="Pei Hwa Presbyterian Primary School"/>
              <Picker.Item label="Pei Tong Primary School" value="Pei Tong Primary School"/>
              <Picker.Item label="Peiying Primary School" value="Peiying Primary School"/>
              <Picker.Item label="Pioneer Primary School" value="Pioneer Primary School"/>
              <Picker.Item label="Poi Ching School" value="Poi Ching School"/>
              <Picker.Item label="Princess Elizabeth Primary School" value="Princess Elizabeth Primary School"/>
              <Picker.Item label="Punggol Cove Primary School" value="Punggol Cove Primary School"/>
              <Picker.Item label="Punggol Green Primary School" value="Punggol Green Primary School"/>
              <Picker.Item label="Punggol Primary School" value="Punggol Primary School"/>
              <Picker.Item label="Punggol View Primary School" value="Punggol View Primary School"/>
              <Picker.Item label="Qifa Primary School" value="Qifa Primary School"/>
              <Picker.Item label="Qihua Primary School" value="Qihua Primary School"/>
              <Picker.Item label="Queenstown Primary School" value="Queenstown Primary School"/>
              <Picker.Item label="Radin Mas Primary School" value="Radin Mas Primary School"/>
              <Picker.Item label="Raffles Girls' Primary School" value="Raffles Girls' Primary School"/>
              <Picker.Item label="Red Swastika School" value="Red Swastika School"/>
              <Picker.Item label="Riverside Primary School" value="Riverside Primary School"/>
              <Picker.Item label="River Valley Primary School" value="River Valley Primary School"/>
              <Picker.Item label="Rivervale Primary School" value="Rivervale Primary School"/>
              <Picker.Item label="Rosyth School" value="Rosyth School"/>
              <Picker.Item label="Rulang Primary School" value="Rulang Primary School"/>
              <Picker.Item label="Sengkang Green Primary School" value="Sengkang Green Primary School"/>
              <Picker.Item label="Sembawang Primary School" value="Sembawang Primary School"/>
              <Picker.Item label="Si Ling Primary School" value="Si Ling Primary School"/>
              <Picker.Item label="Seng Kang Primary School" value="Seng Kang Primary School"/>
              <Picker.Item label="Shuqun Primary School" value="Shuqun Primary School"/>
              <Picker.Item label="Singapore Chinese Girls’ School (Primary)" value="Singapore Chinese Girls’ School (Primary)"/>
              <Picker.Item label="South View Primary School" value="South View Primary School"/>
              <Picker.Item label="Springdale Primary School" value="Springdale Primary School"/>
              <Picker.Item label="St. Andrew's Junior School" value="St. Andrew's Junior School"/>
              <Picker.Item label="St. Anthony's Canossian Primary School" value="St. Anthony's Canossian Primary School"/>
              <Picker.Item label="St. Anthony's Primary School" value="St. Anthony's Primary School"/>
              <Picker.Item label="St. Gabriel's Primary School" value="St. Gabriel's Primary School"/>
              <Picker.Item label="St. Hilda's Primary School" value="St. Hilda's Primary School"/>
              <Picker.Item label="St. Joseph's Institution Junior" value="St. Joseph's Institution Junior"/>
              <Picker.Item label="St. Margaret's Primary School" value="St. Margaret's Primary School"/>
              <Picker.Item label="St. Stephen's School" value="St. Stephen's School"/>
              <Picker.Item label="Tampines North Primary School" value="Tampines North Primary School"/>
              <Picker.Item label="Tampines Primary School" value="Tampines Primary School"/>
              <Picker.Item label="Tanjong Katong Primary School" value="Tanjong Katong Primary School"/>
              <Picker.Item label="Tao Nan School" value="Tao Nan School"/>
              <Picker.Item label="Teck Ghee Primary School" value="Teck Ghee Primary School"/>
              <Picker.Item label="Teck Whye Primary School" value="Teck Whye Primary School"/>
              <Picker.Item label="Telok Kurau Primary School" value="Telok Kurau Primary School"/>
              <Picker.Item label="Temasek Primary School" value="Temasek Primary School"/>
              <Picker.Item label="Townsville Primary School" value="Townsville Primary School"/>
              <Picker.Item label="Unity Primary School" value="Unity Primary School"/>
              <Picker.Item label="Valour Primary School" value="Valour Primary School"/>
              <Picker.Item label="Waterway Primary School" value="Waterway Primary School"/>
              <Picker.Item label="Wellington Primary School" value="Wellington Primary School"/>
              <Picker.Item label="West Grove Primary School" value="West Grove Primary School"/>
              <Picker.Item label="West Spring Primary School" value="West Spring Primary School"/>
              <Picker.Item label="Westwood Primary School" value="Westwood Primary School"/>
              <Picker.Item label="West View Primary School" value="West View Primary School"/>
              <Picker.Item label="White Sands Primary School" value="White Sands Primary School"/>
              <Picker.Item label="Woodgrove Primary School" value="Woodgrove Primary School"/>
              <Picker.Item label="Woodlands Primary School" value="Woodlands Primary School"/>
              <Picker.Item label="Woodlands Ring Primary School" value="Woodlands Ring Primary School"/>
              <Picker.Item label="Xinghua Primary School" value="Xinghua Primary School"/>
              <Picker.Item label="Xingnan Primary School" value="Xingnan Primary School"/>
              <Picker.Item label="Xinmin Primary School" value="Xinmin Primary School"/>
              <Picker.Item label="Xishan Primary School" value="Xishan Primary School"/>
              <Picker.Item label="Yangzheng Primary School" value="Yangzheng Primary School"/>
              <Picker.Item label="Yew Tee Primary School" value="Yew Tee Primary School"/>
              <Picker.Item label="Yio Chu Kang Primary School" value="Yio Chu Kang Primary School"/>
              <Picker.Item label="Yishun Primary School" value="Yishun Primary School"/>
              <Picker.Item label="Yu Neng Primary School" value="Yu Neng Primary School"/>
              <Picker.Item label="Yuhua Primary School" value="Yuhua Primary School"/>
              <Picker.Item label="Yumin Primary School" value="Yumin Primary School"/>
              <Picker.Item label="Zhangde Primary School" value="Zhangde Primary School"/>
              <Picker.Item label="Zhenghua Primary School" value="Zhenghua Primary School"/>
              <Picker.Item label="Zhonghua Primary School" value="Zhonghua Primary School"/>
            </Picker>
          )}  */}

          {eduLevel === "Secondary" && (
            <Picker
              selectedValue={school}
              onValueChange={(itemValue) => setSchool(itemValue)}
            >
              <Picker.Item label="Select your school" value="" />
              <Picker.Item
                label="Admiralty Secondary School"
                value="Admiralty Secondary School"
              />
              <Picker.Item
                label="Ahmad Ibrahim Secondary School"
                value="Ahmad Ibrahim Secondary School"
              />
              <Picker.Item
                label="Anderson Secondary School"
                value="Anderson Secondary School"
              />
              <Picker.Item
                label="Anglican High School"
                value="Anglican High School"
              />
              <Picker.Item
                label="Anglo-Chinese School (Barker Road)"
                value="Anglo-Chinese School (Barker Road)"
              />
              <Picker.Item
                label="Anglo-Chinese School (Independent)"
                value="Anglo-Chinese School (Independent)"
              />
              <Picker.Item
                label="Ang Mo Kio Secondary School"
                value="Ang Mo Kio Secondary School"
              />
              <Picker.Item
                label="Assumption English School"
                value="Assumption English School"
              />
              <Picker.Item
                label="Bartley Secondary School"
                value="Bartley Secondary School"
              />
              <Picker.Item
                label="Beatty Secondary School"
                value="Beatty Secondary School"
              />
              <Picker.Item
                label="Bedok Green Secondary School"
                value="Bedok Green Secondary School"
              />
              <Picker.Item
                label="Bedok South Secondary School"
                value="Bedok South Secondary School"
              />
              <Picker.Item
                label="Bedok View Secondary School"
                value="Bedok View Secondary School"
              />
              <Picker.Item
                label="Bendemeer Secondary School"
                value="Bendemeer Secondary School"
              />
              <Picker.Item
                label="Boon Lay Secondary School"
                value="Boon Lay Secondary School"
              />
              <Picker.Item
                label="Bowen Secondary School"
                value="Bowen Secondary School"
              />
              <Picker.Item
                label="Broadrick Secondary School"
                value="Broadrick Secondary School"
              />
              <Picker.Item
                label="Bukit Batok Secondary School"
                value="Bukit Batok Secondary School"
              />
              <Picker.Item
                label="Bukit Merah Secondary School"
                value="Bukit Merah Secondary School"
              />
              <Picker.Item
                label="Bukit Panjang Government High School"
                value="Bukit Panjang Government High School"
              />
              <Picker.Item
                label="Bukit View Secondary School"
                value="Bukit View Secondary School"
              />
              <Picker.Item
                label="Catholic High School"
                value="Catholic High School"
              />
              <Picker.Item
                label="Canberra Secondary School"
                value="Canberra Secondary School"
              />
              <Picker.Item
                label="Cedar Girls' Secondary School"
                value="Cedar Girls' Secondary School"
              />
              <Picker.Item
                label="Changkat Changi Secondary School"
                value="Changkat Changi Secondary School"
              />
              <Picker.Item
                label="CHIJ Katong Convent (Secondary)"
                value="CHIJ Katong Convent (Secondary)"
              />
              <Picker.Item
                label="CHIJ Secondary (Toa Payoh)"
                value="CHIJ Secondary (Toa Payoh)"
              />
              <Picker.Item
                label="CHIJ St. Joseph's Convent"
                value="CHIJ St. Joseph's Convent"
              />
              <Picker.Item
                label="CHIJ St. Nicholas Girls' School"
                value="CHIJ St. Nicholas Girls' School"
              />
              <Picker.Item
                label="CHIJ St. Theresa's Convent"
                value="CHIJ St. Theresa's Convent"
              />
              <Picker.Item
                label="Chua Chu Kang Secondary School"
                value="Chua Chu Kang Secondary School"
              />
              <Picker.Item
                label="Christ Church Secondary School"
                value="Christ Church Secondary School"
              />
              <Picker.Item
                label="Chung Cheng High School (Main)"
                value="Chung Cheng High School (Main)"
              />
              <Picker.Item
                label="Chung Cheng High School (Yishun)"
                value="Chung Cheng High School (Yishun)"
              />
              <Picker.Item
                label="Clementi Town Secondary School"
                value="Clementi Town Secondary School"
              />
              <Picker.Item
                label="Commonwealth Secondary School"
                value="Commonwealth Secondary School"
              />
              <Picker.Item
                label="Compassvale Secondary School"
                value="Compassvale Secondary School"
              />
              <Picker.Item
                label="Crescent Girls' School"
                value="Crescent Girls' School"
              />
              <Picker.Item
                label="Damai Secondary School"
                value="Damai Secondary School"
              />
              <Picker.Item
                label="Deyi Secondary School"
                value="Deyi Secondary School"
              />
              <Picker.Item
                label="Dunearn Secondary School"
                value="Dunearn Secondary School"
              />
              <Picker.Item
                label="Dunman High School"
                value="Dunman High School"
              />
              <Picker.Item
                label="Dunman Secondary School"
                value="Dunman Secondary School"
              />
              <Picker.Item
                label="East Spring Secondary School"
                value="East Spring Secondary School"
              />
              <Picker.Item
                label="Edgefield Secondary School"
                value="Edgefield Secondary School"
              />
              <Picker.Item
                label="Evergreen Secondary School"
                value="Evergreen Secondary School"
              />
              <Picker.Item
                label="Fairfield Methodist Secondary School"
                value="Fairfield Methodist Secondary School"
              />
              <Picker.Item
                label="Fuchun Secondary School"
                value="Fuchun Secondary School"
              />
              <Picker.Item
                label="Fuhua Secondary School"
                value="Fuhua Secondary School"
              />
              <Picker.Item
                label="Gan Eng Seng School"
                value="Gan Eng Seng School"
              />
              <Picker.Item
                label="Geylang Methodist School (Secondary)"
                value="Geylang Methodist School (Secondary)"
              />
              <Picker.Item
                label="Greendale Secondary School"
                value="Greendale Secondary School"
              />
              <Picker.Item
                label="Greenridge Secondary School"
                value="Greenridge Secondary School"
              />
              <Picker.Item
                label="Guangyang Secondary School"
                value="Guangyang Secondary School"
              />
              <Picker.Item
                label="Hai Sing Catholic School"
                value="Hai Sing Catholic School"
              />
              <Picker.Item
                label="Hillgrove Secondary School"
                value="Hillgrove Secondary School"
              />
              <Picker.Item
                label="Holy Innocents' High School"
                value="Holy Innocents' High School"
              />
              <Picker.Item
                label="Hougang Secondary School"
                value="Hougang Secondary School"
              />
              <Picker.Item
                label="Hua Yi Secondary School"
                value="Hua Yi Secondary School"
              />
              <Picker.Item
                label="Hwa Chong Institution"
                value="Hwa Chong Institution"
              />
              <Picker.Item
                label="Junyuan Secondary School"
                value="Junyuan Secondary School"
              />
              <Picker.Item
                label="Jurong Secondary School"
                value="Jurong Secondary School"
              />
              <Picker.Item
                label="Jurong West Secondary School"
                value="Jurong West Secondary School"
              />
              <Picker.Item
                label="Jurongville Secondary School"
                value="Jurongville Secondary School"
              />
              <Picker.Item
                label="Juying Secondary School"
                value="Juying Secondary School"
              />
              <Picker.Item
                label="Kent Ridge Secondary School"
                value="Kent Ridge Secondary School"
              />
              <Picker.Item
                label="Kranji Secondary School"
                value="Kranji Secondary School"
              />
              <Picker.Item
                label="Kuo Chuan Presbyterian Secondary School"
                value="Kuo Chuan Presbyterian Secondary School"
              />
              <Picker.Item
                label="Loyang View Secondary School"
                value="Loyang View Secondary School"
              />
              <Picker.Item
                label="Manjusri Secondary School"
                value="Manjusri Secondary School"
              />
              <Picker.Item
                label="Maris Stella High School"
                value="Maris Stella High School"
              />
              <Picker.Item
                label="Marsiling Secondary School"
                value="Marsiling Secondary School"
              />
              <Picker.Item
                label="Mayflower Secondary School"
                value="Mayflower Secondary School"
              />
              <Picker.Item
                label="Meridian Secondary School"
                value="Meridian Secondary School"
              />
              <Picker.Item
                label="Methodist Girls' School (Secondary)"
                value="Methodist Girls' School (Secondary)"
              />
              <Picker.Item
                label="Montfort Secondary School"
                value="Montfort Secondary School"
              />
              <Picker.Item
                label="Nan Chiau High School"
                value="Nan Chiau High School"
              />
              <Picker.Item
                label="Nan Hua High School"
                value="Nan Hua High School"
              />
              <Picker.Item
                label="Nanyang Girls' High School"
                value="Nanyang Girls' High School"
              />
              <Picker.Item
                label="National Junior College"
                value="National Junior College"
              />
              <Picker.Item
                label="Naval Base Secondary School"
                value="Naval Base Secondary School"
              />
              <Picker.Item
                label="New Town Secondary School"
                value="New Town Secondary School"
              />
              <Picker.Item
                label="Ngee Ann Secondary School"
                value="Ngee Ann Secondary School"
              />
              <Picker.Item
                label="North Vista Secondary School"
                value="North Vista Secondary School"
              />
              <Picker.Item
                label="Northbrooks Secondary School"
                value="Northbrooks Secondary School"
              />
              <Picker.Item
                label="Northland Secondary School"
                value="Northland Secondary School"
              />
              <Picker.Item
                label="NUS High School of Mathematics and Science"
                value="NUS High School of Mathematics and Science"
              />
              <Picker.Item
                label="Orchid Park Secondary School"
                value="Orchid Park Secondary School"
              />
              <Picker.Item
                label="Outram Secondary School"
                value="Outram Secondary School"
              />
              <Picker.Item
                label="Pasir Ris Crest Secondary School"
                value="Pasir Ris Crest Secondary School"
              />
              <Picker.Item
                label="Pasir Ris Secondary School"
                value="Pasir Ris Secondary School"
              />
              <Picker.Item
                label="Paya Lebar Methodist Girls' School (Secondary)"
                value="Paya Lebar Methodist Girls' School (Secondary)"
              />
              <Picker.Item
                label="Pei Hwa Secondary School"
                value="Pei Hwa Secondary School"
              />
              <Picker.Item
                label="Peicai Secondary School"
                value="Peicai Secondary School"
              />
              <Picker.Item
                label="Peirce Secondary School"
                value="Peirce Secondary School"
              />
              <Picker.Item
                label="Presbyterian High School"
                value="Presbyterian High School"
              />
              <Picker.Item
                label="Punggol Secondary School"
                value="Punggol Secondary School"
              />
              <Picker.Item
                label="Queenstown Secondary School"
                value="Queenstown Secondary School"
              />
              <Picker.Item
                label="Queensway Secondary School"
                value="Queensway Secondary School"
              />
              <Picker.Item
                label="Raffles Girls' School (Secondary)"
                value="Raffles Girls' School (Secondary)"
              />
              <Picker.Item
                label="Raffles Institution"
                value="Raffles Institution"
              />
              <Picker.Item
                label="Regent Secondary School"
                value="Regent Secondary School"
              />
              <Picker.Item
                label="Riverside Secondary School"
                value="Riverside Secondary School"
              />
              <Picker.Item
                label="River Valley High School"
                value="River Valley High School"
              />
              <Picker.Item
                label="St. Andrew's Secondary School"
                value="St. Andrew's Secondary School"
              />
              <Picker.Item
                label="St. Patrick's School"
                value="St. Patrick's School"
              />
              <Picker.Item
                label="School of Science and Technology, Singapore"
                value="School of Science and Technology, Singapore"
              />
              <Picker.Item
                label="School of the Arts"
                value="School of the Arts"
              />
              <Picker.Item
                label="Sembawang Secondary School"
                value="Sembawang Secondary School"
              />
              <Picker.Item
                label="Sengkang Secondary School"
                value="Sengkang Secondary School"
              />
              <Picker.Item
                label="Serangoon Garden Secondary School"
                value="Serangoon Garden Secondary School"
              />
              <Picker.Item
                label="Serangoon Secondary School"
                value="Serangoon Secondary School"
              />
              <Picker.Item
                label="Singapore Chinese Girls' School"
                value="Singapore Chinese Girls' School"
              />
              <Picker.Item
                label="Singapore Sports School"
                value="Singapore Sports School"
              />
              <Picker.Item
                label="Springfield Secondary School"
                value="Springfield Secondary School"
              />
              <Picker.Item
                label="St. Anthony's Canossian Secondary School"
                value="St. Anthony's Canossian Secondary School"
              />
              <Picker.Item
                label="St. Gabriel's Secondary School"
                value="St. Gabriel's Secondary School"
              />
              <Picker.Item
                label="St. Hilda's Secondary School"
                value="St. Hilda's Secondary School"
              />
              <Picker.Item
                label="St. Margaret's Secondary School"
                value="St. Margaret's Secondary School"
              />
              <Picker.Item
                label="St. Joseph's Institution"
                value="St. Joseph's Institution"
              />
              <Picker.Item
                label="Swiss Cottage Secondary School"
                value="Swiss Cottage Secondary School"
              />
              <Picker.Item
                label="Tanglin Secondary School"
                value="Tanglin Secondary School"
              />
              <Picker.Item
                label="Tampines Secondary School"
                value="Tampines Secondary School"
              />
              <Picker.Item
                label="Tanjong Katong Girls' School"
                value="Tanjong Katong Girls' School"
              />
              <Picker.Item
                label="Tanjong Katong Secondary School"
                value="Tanjong Katong Secondary School"
              />
              <Picker.Item
                label="Temasek Junior College"
                value="Temasek Junior College"
              />
              <Picker.Item
                label="Temasek Secondary School"
                value="Temasek Secondary School"
              />
              <Picker.Item
                label="Unity Secondary School"
                value="Unity Secondary School"
              />
              <Picker.Item label="Victoria School" value="Victoria School" />
              <Picker.Item
                label="West Spring Secondary School"
                value="West Spring Secondary School"
              />
              <Picker.Item
                label="Westwood Secondary School"
                value="Westwood Secondary School"
              />
              <Picker.Item
                label="Whitley Secondary School"
                value="Whitley Secondary School"
              />
              <Picker.Item
                label="Woodgrove Secondary School"
                value="Woodgrove Secondary School"
              />
              <Picker.Item
                label="Woodlands Ring Secondary School"
                value="Woodlands Ring Secondary School"
              />
              <Picker.Item
                label="Woodlands Secondary School"
                value="Woodlands Secondary School"
              />
              <Picker.Item
                label="Xinmin Secondary School"
                value="Xinmin Secondary School"
              />
              <Picker.Item
                label="Yio Chu Kang Secondary School"
                value="Yio Chu Kang Secondary School"
              />
              <Picker.Item
                label="Yishun Secondary School"
                value="Yishun Secondary School"
              />
              <Picker.Item
                label="Yishun Town Secondary School"
                value="Yishun Town Secondary School"
              />
              <Picker.Item
                label="Yuan Ching Secondary School"
                value="Yuan Ching Secondary School"
              />
              <Picker.Item
                label="Yuhua Secondary School"
                value="Yuhua Secondary School"
              />
              <Picker.Item
                label="Yusof Ishak Secondary School"
                value="Yusof Ishak Secondary School"
              />
              <Picker.Item
                label="Yuying Secondary School"
                value="Yuying Secondary School"
              />
              <Picker.Item
                label="Zhenghua Secondary School"
                value="Zhenghua Secondary School"
              />
              <Picker.Item
                label="Zhonghua Secondary School"
                value="Zhonghua Secondary School"
              />
            </Picker>
          )}

          {eduLevel === "Junior College" && (
            <Picker
              selectedValue={school}
              onValueChange={(itemValue) => setSchool(itemValue)}
            >
              <Picker.Item label="Select your school" value="" />
              <Picker.Item
                label="Anderson Serangoon Junior College"
                value="Anderson Serangoon Junior College"
              />
              <Picker.Item
                label="Anglo-Chinese Junior College"
                value="Anglo-Chinese Junior College"
              />
              <Picker.Item
                label="Anglo-Chinese School (Independent) (Junior College)"
                value="Anglo-Chinese School (Independent) (Junior College)"
              />
              <Picker.Item
                label="Catholic Junior College"
                value="Catholic Junior College"
              />
              <Picker.Item
                label="Dunman High School (Junior College)"
                value="Dunman High School (Junior College)"
              />
              <Picker.Item
                label="Eunoia Junior College"
                value="Eunoia Junior College"
              />
              <Picker.Item
                label="Hwa Chong Institution (Junior College)"
                value="Hwa Chong Institution (Junior College)"
              />
              <Picker.Item
                label="Jurong Pioneer Junior College"
                value="Jurong Pioneer Junior College"
              />
              <Picker.Item
                label="Millennia Institute"
                value="Millennia Institute"
              />
              <Picker.Item
                label="Nanyang Junior College"
                value="Nanyang Junior College"
              />
              <Picker.Item
                label="National Junior College"
                value="National Junior College"
              />
              <Picker.Item
                label="NUS High School of Mathematics and Science"
                value="NUS High School of Mathematics and Science"
              />
              <Picker.Item
                label="Raffles Institution (Junior College)"
                value="Raffles Institution (Junior College)"
              />
              <Picker.Item
                label="River Valley High School (Junior College)"
                value="River Valley High School (Junior College)"
              />
              <Picker.Item
                label="School of the Arts, Singapore"
                value="School of the Arts, Singapore"
              />
              <Picker.Item
                label="School of the Arts, Singapore"
                value="School of the Arts, Singapore"
              />
              <Picker.Item
                label="St Andrew’s Junior College"
                value="St Andrew’s Junior College"
              />
              <Picker.Item
                label="St. Joseph’s Institution (Junior College)"
                value="St. Joseph’s Institution (Junior College)"
              />
              <Picker.Item
                label="Tampines Meridian Junior College"
                value="Tampines Meridian Junior College"
              />
              <Picker.Item
                label="Temasek Junior College"
                value="Temasek Junior College"
              />
              <Picker.Item
                label="Temasek Junior College"
                value="Temasek Junior College"
              />
              <Picker.Item
                label="Yishun Innova Junior College"
                value="Yishun Innova Junior College"
              />
            </Picker>
          )}

          {eduLevel === "Polytechnic" && showSchools && (
            <Picker
              selectedValue={school}
              onValueChange={(itemValue) => setSchool(itemValue)}
            >
              <Picker.Item label="Select your school" value="" />
              <Picker.Item
                label="Nanyang Polytechnic"
                value="Nanyang Polytechnic"
              />
              <Picker.Item
                label="Ngee Ann Polytechnic"
                value="Ngee Ann Polytechnic"
              />
              <Picker.Item
                label="Republic Polytechnic"
                value="Republic Polytechnic"
              />
              <Picker.Item
                label="Singapore Polytechnic"
                value="Singapore Polytechnic"
              />
              <Picker.Item
                label="Temasek Polytechnic"
                value="Temasek Polytechnic"
              />
            </Picker>
          )}

          {eduLevel === "University" && (
            <Picker
              selectedValue={school}
              onValueChange={(itemValue) => setSchool(itemValue)}
            >
              <Picker.Item label="Select your school" value="" />
              <Picker.Item
                label="National University of Singapore"
                value="National University of Singapore"
              />
              <Picker.Item
                label="Nanyang Technological University"
                value="Nanyang Technological University"
              />
              <Picker.Item
                label="Singapore Management University"
                value="Singapore Management University"
              />
              <Picker.Item
                label="Singapore University of Technology and Design"
                value="Singapore University of Technology and Design"
              />
              <Picker.Item
                label="Singapore Institute of Technology"
                value="Singapore Institute of Technology"
              />
              <Picker.Item
                label="Singapore University of Social Sciences"
                value="Singapore University of Social Sciences"
              />
            </Picker>
          )}
        </View>

        <MultipleSelectList
          boxStyles={styles.textInput}
          setSelected={(val) => setStrengths(val)}
          data={subjects}
          placeholder="Select your strong subjects"
          label="Your strong subjects"
          onSelect={() => console.log(strengths)}
          save="value"
          notFoundText="No subject exists"
        />

        <MultipleSelectList
          boxStyles={styles.textInput}
          setSelected={(val) => setWeaknesses(val)}
          data={subjects}
          placeholder="Select your weak subjects"
          label="Your weak subjects"
          onSelect={() => console.log(weaknesses)}
          save="value"
          notFoundText="No subject exists"
        />
      </View>

      <View
        style={{
          alignItems: "center",
          marginTop: 10,
          height: 200,
        }}
      >
        <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
          <Text style={{ color: "white" }}>Pick a Profile Picture</Text>
        </TouchableOpacity>
        {image ? (
          <Image source={{ uri: image }} style={styles.pfp} />
        ) : (
          <Image
            source={require("../../assets/images/emptyPic.png")}
            style={styles.pfp}
          />
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleProfileEdit} style={styles.button}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  uploadButton: {
    padding: 10,
    backgroundColor: colors.darkBlue,
    borderRadius: 10,
    marginBottom: 20,
  },
  container: {
    minHeight: "100%",
    backgroundColor: colors.limeGreen,
    alignItems: "center",
    paddingVertical: 50,
    paddingBottom: 100,
    flexGrow: 1,
  },
  pfp: {
    marginTop: 100,
    height: 200,
    width: 200,
    borderRadius: 400,
    borderWidth: 2,
    borderColor: colors.brown,
    marginBottom: 50,
  },
  profile: {
    backgroundColor: colors.lightPink,
    flex: 1,
    width: "100%",
    borderRadius: 30,
  },
  profileHeader: {
    marginTop: 20,
    marginLeft: 25,
    fontSize: 30,
  },
  updateButton: {
    backgroundColor: colors.limeGreen,
    alignSelf: "center",
    marginTop: 20,
    padding: 10,
    borderRadius: 25,
    borderWidth: 2,
    height: 50,
    width: 150,
  },
  updateText: {
    color: "black",
    fontSize: 20,
    alignSelf: "center",
  },
  textInput: {
    backgroundColor: colors.lightPink,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  inputContainer: {
    marginTop: 40,
    width: "80%",
  },
  button: {
    backgroundColor: colors.darkBlue,
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonOutline: {
    backgroundColor: colors.limeGreen,
    marginTop: 5,
    borderColor: "black",
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineText: {
    color: "black",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  pickerInput: {
    backgroundColor: colors.lightPink,
    paddingHorizontal: 15,
    paddingVertical: 0,
    borderRadius: 10,
    marginTop: 5,
  },
  pfp: {
    height: 200,
    width: 200,
    borderRadius: 400,
    borderWidth: 2,
    borderColor: colors.brown,
    marginBottom: 10,
  },
});
