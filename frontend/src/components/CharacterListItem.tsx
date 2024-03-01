import { memo } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export type Character = {
  id: number;
  name: string;
  image?: string;
};

type CharacterListItem = {
  character: Character;
};

const CharacterListItem = ({ character }: CharacterListItem) => {
  console.log(111, character.id);

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{character.name}</Text>
      <Image source={{ uri: character.image }} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "darkslategrey",
    alignSelf: "center",
    marginVertical: 10,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
});

export default memo(CharacterListItem, (prevProps, nextProps) => {
  return prevProps.character.id === nextProps.character.id;
});
