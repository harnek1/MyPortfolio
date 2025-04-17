import { useNavigation } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';

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

const searchHero = async (id:any) => {
  try {
    const res = await fetch(`/api/${encodeURIComponent(id)}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("API error:", err);
    return null;
  }
};

export default function Detailsscreen() {

 const params= useLocalSearchParams()
 const navigation = useNavigation()

  const [character, setCharacter] = useState<Character | null>(null);


  const sections = [
    {
      title: 'Powerstats',
      data: {
        Intelligence: character?.powerstats.intelligence,
        Strength: character?.powerstats.strength,
        Speed: character?.powerstats.speed,
        Durability: character?.powerstats.durability,
        Power: character?.powerstats.power,
        Combat: character?.powerstats.combat,
      }

    },
    {
      title: 'Biography',
      data: {
        'Full Name': character?.biography["full-name"],
        Publisher: character?.biography.publisher,
        Aliases: character?.biography.aliases.join(', '),
        Alignment: character?.biography.alignment,
      },
    },
    {
      title: 'Appearance',
      data: {
        Gender: character?.appearance.gender,
        Race: character?.appearance.race,
        Height: character?.appearance.height.join(', '),
        Weight: character?.appearance.weight.join(', '),
        'Eye Color': character?.appearance["eye-color"],
        'Hair Color': character?.appearance["hair-color"],
      },
    },
    {
      title: 'Work',
      data: {
        Occupation: character?.work.occupation,
        Base: character?.work.base,
      },
    },
    {
      title: 'Connections',
      data: {
        Group: character?.connections["group-affiliation"],
        Relatives: character?.connections.relatives,
      },
    },
  ];

  useLayoutEffect(() => {
    if (character) {
      navigation.setOptions({ title: "Details of the: "+character.name });
    }
  }, [character, navigation]);
 
  const getSearchResults = async () => {
    const results = await searchHero(params.id);
    setCharacter(results)
  }

  useEffect(() => {
    if (params.id) {
      getSearchResults();
    }
  }, [params.id]);

  if (!character) {
    return <Text>Loading...</Text>;
  }


  return (
    <ScrollView contentContainerStyle={{
      alignItems: 'center',
      justifyContent: 'center'
    }} >
      
      <Image style={styles.image} source={{ uri: character.image.url }} />
      <Text style={styles.name}>{character.name}</Text>

      <View style={styles.row}>
        {sections.map((section) => (
          <View key={section.title} style={styles.column}>
            <Text style={styles.columnTitle}>{section.title}</Text>
            {Object.entries(section.data  ?? {}).map(([key, value]) => (
              <Text key={key} style={styles.item}>
                <Text style={styles.label}>{key}:</Text> {value}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  column: {
    width: "26%",
    paddingHorizontal: 4,
    alignItems: 'center',
    marginBottom: 10,
  },
  columnTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 6,
    textAlign: 'center',
  },
  item: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 6,
  },
  label: {
    fontWeight: '600',
  },
});