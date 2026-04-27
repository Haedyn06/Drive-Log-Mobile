import { useState, useRef, useEffect } from "react";
import { Modal, View, Text, Image, StyleSheet, ScrollView, Pressable, LayoutAnimation, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { SessionCheckpoint } from "@/types/sessionObj/CheckpointType";

import { formatDistance, formatTimeOnly } from "@/utils/format";
import ImagePreviewComp from "./ImagePreviewComp";
import ConfirmationPopup from "./ConfirmationPopup";

type CheckpointDetailsModalProps = {
    checkpoints: SessionCheckpoint[];
    selectedIndex: number | null;
    setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
    onFocusCheckpoint: (index: number) => void;
    onDelete: () => void;
};

export default function CheckpointDetailsModal({ checkpoints, selectedIndex, setSelectedIndex, onFocusCheckpoint, onDelete }: CheckpointDetailsModalProps) {
    const [previewIndex, setPreviewIndex] = useState<number | null>(null);
    const translateY = useRef(new Animated.Value(20)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const hasImages = !!checkpoint?.images?.length;

        translateY.setValue(hasImages ? 20 : 0);
        opacity.setValue(hasImages ? 0 : 1);

        Animated.parallel([
            Animated.timing(translateY, {
                toValue: hasImages ? 0 : 20,
                duration: 220,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: hasImages ? 1 : 0,
                duration: 220,
                useNativeDriver: true,
            }),
        ]).start();
    }, [selectedIndex]);

    if (selectedIndex === null) return null;
    const checkpoint = checkpoints[selectedIndex];

    const handleNext = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const nextIndex = selectedIndex === checkpoints.length - 1 ? 0 : selectedIndex + 1;
        setSelectedIndex(nextIndex);
        onFocusCheckpoint(nextIndex);
    }

    const handlePrev = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const nextIndex = selectedIndex === 0 ? checkpoints.length - 1 : selectedIndex - 1;
        setSelectedIndex(nextIndex);
        onFocusCheckpoint(nextIndex);
    }

    return (
        <Modal visible transparent animationType="slide">
            <Pressable style={styles.checkpointModalOverlay} onPress={() => setSelectedIndex(null)}>
                <Pressable style={styles.checkpointModalBox} onPress={(e) => e.stopPropagation()}>

                    {/* Images */}
                    
                    <Animated.View
                        style={[
                            styles.imageContainer,
                            {
                                opacity,
                                transform: [{ translateY }],
                            },
                            !checkpoint?.images?.length && styles.imageContainerHidden,
                        ]}
                    >
                        {!!checkpoint?.images?.length && (
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {checkpoint.images.map((uri, index) => (
                                    <Pressable key={`${uri}-${index}`} onPress={() => setPreviewIndex(index)}>
                                        <Image source={{ uri }} style={styles.checkpointModalImage} />
                                    </Pressable>
                                ))}
                            </ScrollView>
                        )}
                    </Animated.View>

                    


                    {/* Details */}
                    <View style={styles.bottomRow}>
                        <Pressable style={styles.arrowBtn} onPress={handlePrev}>
                            <Ionicons name="chevron-back" size={22} color="#222" />
                        </Pressable>

                        <View style={styles.detailsContainer}>
                            <View style={styles.headingDetails}>
                                <Text style={styles.checkpointModalTitle}>{checkpoint?.type ?? "Checkpoint"}</Text>
                                <Pressable onPress={() => setShowPopup(true)}>
                                    <Ionicons name="trash" size={16} />
                                </Pressable>
                            </View>

                            <Text style={styles.checkpointModalText}>
                                {formatDistance(checkpoint?.distance ?? 0)} • {" "}
                                {formatTimeOnly(checkpoint?.timestamp ?? 0)}
                            </Text>

                            <Text style={styles.checkpointModalText}>
                                {checkpoint?.location.latitude.toFixed(4)},{" "}
                                {checkpoint?.location.longitude.toFixed(4)}
                            </Text>

                            <Text style={styles.checkpointModalNotes}>{checkpoint?.notes || "No note"}</Text>
                        </View>

                        <Pressable style={styles.arrowBtn} onPress={handleNext}>
                            <Ionicons name="chevron-forward" size={22} color="#222" />
                        </Pressable>
                    </View>

                    <View style={styles.checkpointNavRow}>
                        <Text style={styles.countText}>
                            {selectedIndex + 1} / {checkpoints.length}
                        </Text>
                    </View>
                    

                </Pressable>
            </Pressable>

            <ImagePreviewComp images={checkpoint?.images ?? []} previewIndex={previewIndex} setPreviewIndex={setPreviewIndex} />
            <ConfirmationPopup 
                visible={showPopup}
                label="delete this checkpoint"
                onCancel={() => setShowPopup(false)}
                onConfirm={() => {
                    onDelete();
                    setShowPopup(false);
                }}
            
            />
        </Modal>
    );
}



const styles = StyleSheet.create({
    checkpointModalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
    },

    checkpointModalBox: {
        width: "100%",
        padding: 16,
        paddingBottom: 26,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },

    imageContainer: {
        alignSelf: 'center',
        width: '80%',
        marginBottom: 18,
        padding: 12,
        borderRadius: 16,
        backgroundColor: "rgba(0,0,0,0.05)",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.08)",
    },

    checkpointModalImage: {
        width: 92,
        height: 92,
        borderRadius: 14,
        marginRight: 10,
        backgroundColor: "#eee",
    },

    bottomRow: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 10,
    },

    arrowBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
    },

    detailsContainer: {
        flex: 1,
        backgroundColor: "#ffffff",
        borderRadius: 18,
        padding: 14,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
    },

    headingDetails: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'space-between'
    },
    
    imageContainerHidden: {
        height: 0,
        padding: 0,
        marginBottom: 0,
        overflow: "hidden",
    },

    checkpointModalTitle: {
        fontSize: 18,
        fontWeight: "700",
        textTransform: "capitalize",
        color: "#111",
    },

    checkpointModalText: {
        marginTop: 5,
        color: "#555",
        fontSize: 13,
    },

    checkpointModalNotes: {
        marginTop: 10,
        color: "#222",
        fontSize: 14,
        lineHeight: 19,
    },

    checkpointNavRow: {
        alignItems: "center",
        marginTop: 4,
        marginBottom: 10,
    },

    countText: {
        fontSize: 13,
        color: "#777",
        fontWeight: "600",
    },

    closeButton: {
        alignSelf: "center",
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 999,
        backgroundColor: "#ffecec",
    },

    closeText: {
        color: "#ff3b30",
        fontWeight: "700",
    },
});