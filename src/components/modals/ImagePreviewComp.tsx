import { Modal, Image, Pressable, View, FlatList, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

type Props = {
    images: string[];
    previewIndex: number | null;
    setPreviewIndex: (value: number | null) => void;
};

export default function ImagePreviewComp({ images, previewIndex, setPreviewIndex }: Props) {
    if (previewIndex === null) return null;

    return (
        <Modal visible transparent animationType="fade">
            <View style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.95)",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <Pressable
                    onPress={() => setPreviewIndex(null)}
                    style={{
                        position: "absolute",
                        top: 50,
                        right: 20,
                        zIndex: 10,
                        padding: 8,
                    }}
                >
                    <Ionicons name="close" size={30} color="white" />
                </Pressable>

                <FlatList
                    data={images}
                    horizontal
                    pagingEnabled
                    initialScrollIndex={previewIndex}
                    keyExtractor={(item, index) => `${item}-${index}`}
                    getItemLayout={(_, index) => ({
                        length: width,
                        offset: width * index,
                        index,
                    })}
                    renderItem={({ item }) => (
                        <View style={{ width, justifyContent: "center", alignItems: "center" }}>
                            <Image
                                source={{ uri: item }}
                                style={{
                                    width: "90%",
                                    height: "75%",
                                    borderRadius: 12,
                                }}
                                resizeMode="contain"
                            />
                        </View>
                    )}
                />
            </View>
        </Modal>
    );
}