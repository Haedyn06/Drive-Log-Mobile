import { Pressable, View, StyleSheet, ViewStyle, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { FPSType } from "@/composables/useFreeMap";
import type { FilterType } from "@/composables/useFreeMap";

type FreeMapControlsProps = {
    style?: ViewStyle;
    handlePerspective: () => void;
    fpsType: FPSType;
    filterType: FilterType;
    handleFilterType: (typeFilter: FilterType) => void;
}

export default function FreeMapControls({style, handlePerspective, fpsType, filterType, handleFilterType}: FreeMapControlsProps) {


    return (
        <View style={[styles.container, style]}>
            <View style={styles.topRow}>
                {/* Left */}
                <View style={styles.leftContainer}>
                    {filterType !== 'none' &&  (
                        <View style={{display:'flex', flexDirection:'row', gap:10}}>
                            <Pressable onPress={() => handleFilterType('pinned')} style={[styles.filterBtn, {backgroundColor: 'black', borderWidth:1, borderColor: filterType === 'pinned' ? 'white' : 'black'}]}>
                                <Text style={{color: 'white'}}>Pinned Locations</Text>
                            </Pressable>

                            <Pressable onPress={() => handleFilterType('saved')} style={[styles.filterBtn, {backgroundColor: 'black', borderWidth:1, borderColor: filterType === 'saved' ? 'white' : 'black'}]}>
                                <Text style={{color:'white'}}>Saved Routes</Text>
                            </Pressable>
                        </View>
                    )}
                </View>

                {/* Middle */}
                <View style={styles.midContainer}>
                </View>

                {/* Right */}
                <View style={styles.rightContainer}>
                    <Pressable style={styles.fpsBtn} onPress={handlePerspective} >
                        {fpsType === "first" ? 
                            <Ionicons name='navigate' size={30} color='white' /> : <Ionicons name='navigate-outline' size={30} color='white' />
                        }
                    </Pressable>
                </View>
            </View>

            <View style={styles.bottomRow}>
                <Pressable style={{position:'absolute',top: 16, left:12, padding:3, borderRadius:90, backgroundColor:'black'}} onPress={() => handleFilterType('none')}>
                    <Ionicons name="close-outline" size={25} color={'white'} />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        height: 175,

        justifyContent: 'center',
        alignItems: 'center',
    },

    topRow: {
        top: 0,
        height: 90,
        width:'100%',
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'center',
    },
    
    bottomRow: {
        top:90,
        height: 86,
        width:'100%',
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'center',
    },

    leftContainer: {
        marginTop: 'auto',
        marginBottom: 12,
        marginLeft:12,
    },

    midContainer: {
        alignSelf: 'center',
        alignItems: 'center'
    },

    txtBtn: {
        padding: 12,
        backgroundColor: 'black',
        borderRadius: 16,
        borderWidth: 2
    },

    rightContainer: {
        flexDirection: 'column',
        gap: 10,
        marginRight:12
    },


    fpsBtn: {
        width: 70,
        height: 70,
        borderRadius: 60,
        backgroundColor: "#111",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
        elevation: 999,
    },

    filterBtn: {
        borderWidth: 2,
        padding: 5,
        borderRadius: 16,
    },

    locBtn: {
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: "#111",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
        elevation: 999,
    }
})