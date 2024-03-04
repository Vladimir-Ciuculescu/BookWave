import BWPressable from "components/shared/BWPressable";
import { memo } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Chip } from "react-native-ui-lib";
import { Category } from "types/enums/categories.enum";
import { COLORS } from "utils/colors";

interface CategoriesProps {
  selectedCategories: Category[];
  categories: Category[];
  onToggle: (e: Category) => void;
}

const Categories: React.FC<CategoriesProps> = memo(({ selectedCategories, categories, onToggle }) => {
  return (
    <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={styles.categoriesContainer}>
      {categories.map((category: Category) => (
        <BWPressable key={category} onPress={() => onToggle(category)}>
          <Chip
            key={category}
            label={category}
            labelStyle={[selectedCategories.includes(category) ? styles.selectedLabel : styles.unselectedLabel, styles.categoryLabel]}
            containerStyle={[selectedCategories.includes(category) ? styles.selectedContainer : styles.unselectedContainer, styles.categoryContainer]}
          />
        </BWPressable>
      ))}
    </ScrollView>
  );
});

export default Categories;

const styles = StyleSheet.create({
  categoriesContainer: {
    gap: 15,
    paddingHorizontal: 15,

    alignItems: "center",
    paddingVertical: 5,
  },
  categoryLabel: {
    fontFamily: "Minomu",
    fontSize: 14,
  },

  selectedLabel: {
    color: COLORS.MUTED[50],
  },

  unselectedLabel: {
    color: COLORS.WARNING[500],
  },
  selectedContainer: {
    backgroundColor: COLORS.WARNING[500],
  },

  unselectedContainer: {
    backgroundColor: "transparent",
  },
  categoryContainer: {
    height: 40,
    borderColor: COLORS.WARNING[500],
    borderWidth: 2,
  },
});
