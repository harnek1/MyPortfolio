import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Button, FlatList, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

interface Character {
    id: string;
    name: string;
    image: { url: string };
    powerstats: {
      intelligence: string;
      strength: string;
      speed: string;
      durability: string;
      power: string;
      combat: string;
    };
    biography: {
      "full-name": string;
      "alter-egos": string;
      aliases: string[];
      "place-of-birth": string;
      "first-appearance": string;
      publisher: string;
      alignment: string;
    };
    appearance: {
      gender: string;
      race: string;
      height: string[];
      weight: string[];
      "eye-color": string;
      "hair-color": string;
    };
    work: { occupation: string; base: string };
    connections: { "group-affiliation": string; relatives: string };
  }
  


  export default function Searchscreen() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<Character[]>([]);
  const [check_Error, setError] = useState('');
  const [check, setCheck] = useState(false);
  const API_KEY = process.env.EXPO_PUBLIC_API_KEY
  
  const controller = useRef<AbortController | null>(null);
  controller.current = new AbortController();
  let isMounted = true;

  const getSearchResults = async () => {
    setLoading(true);
    setError('');
    try {
      if(text.length > 1) {
      const response = await fetch(`https://superheroapi.com/api/${API_KEY}/search/${text}`, { signal: controller.current?.signal });
      console.log("response",response)
      const json = await response.json();
      console.log("json",json)
      if (isMounted) 
      {
        setData(json.results);
        console.log("Data",data)
        if (check) 
        {

          if (text.length < 1) 
          {

            setError("Please enter at least one character.")

          } else if (text.length > 0 && json.response === "error") 
          {

            setError("Cannot find character")
          }

          if (text.length > 0 && json.response === "success") 
          {
            setError("")
          }
        }
          setCheck(true)
        }
      }

    } catch (error) {
      console.error(error);

    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }

  }

  useEffect(() => 
  {

    getSearchResults()
  
    setText("")
    setData([]);
    setCheck(false);
    setError("")

    return () => {
      controller.current?.abort(); 
      isMounted = false;

    }
  }, []);

  return (

    <ScrollView contentContainerStyle={{
      alignItems: 'center',
      justifyContent: 'center'
    }}>

      <View style={{ flexDirection: "row"}}>
        <TextInput style={styles.input} value={text} onChangeText={text => setText(text)} placeholder="Please enter a character" />
        <Button onPress={() => { getSearchResults() }} title="Search" />
      </View>

      <Text style={styles.error}>{check_Error}</Text>

      {isLoading ? <ActivityIndicator /> : (
        <FlatList
          data={data}
          renderItem={({ item }) =>
            <View style={styles.flatListImage}>
              <Text>{item.name}</Text>
              <TouchableOpacity onPress={() => router.push({pathname: '/details', params: { id: item.id.toString()}})}>
                <Image style={styles.image} source={{ uri: item.image.url } } />
              </TouchableOpacity>
            </View>}
          keyExtractor={item => item.id} style={styles.flatList}  />
      )}
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
  },
  error: {
    color: 'red',
  },
  image: {
    width: 100,
    height: 100,
  },
  flatList: {
    marginTop: 20,
  },
  flatListImage: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
});
