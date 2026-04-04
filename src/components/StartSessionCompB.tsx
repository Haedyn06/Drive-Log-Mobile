import { Text, View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type StartSessionCompBProps = {
    isStart: boolean;
    isPaused: boolean;
    elapsed: number;
    speedKmh: number;
    distanceMeters: number;
    handleSession: () => void;
    handleEndSession: () => void;
    resetSession: () => void;
};

export default function StartSessionCompB({
    isStart,
    isPaused,
    elapsed,
    handleSession,
    handleEndSession,
    resetSession
}: StartSessionCompBProps) {
    const hasSession = isStart || isPaused || elapsed > 0;

    const mainIcon = isStart
        ? 'pause'
        : isPaused
        ? 'play'
        : 'play';

    return (
        <View style={styles.wrapper}>
            <View style={styles.card}>

                <Pressable style={styles.mainPill} onPress={handleSession}>
                    <Ionicons
                        name={mainIcon}
                        size={58}
                        color="#ffffff"
                        style={styles.mainIcon}
                    />
                </Pressable>

            </View>

            {hasSession && (
                <View style={styles.bottomRow}>
                    <Pressable style={[styles.bottomBtn, styles.finishBtn]} onPress={handleEndSession}>
                        <Ionicons name="flag-outline" size={20} color="#111" />
                        <Text style={styles.finishText}>Finish</Text>
                    </Pressable>

                    <Pressable style={[styles.bottomBtn, styles.resetBtn]} onPress={resetSession}>
                        <Ionicons name="refresh-outline" size={20} color="#fff" />
                        <Text style={styles.resetText}>Reset</Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginHorizontal: 18,
        marginTop: 12,
        marginBottom: 18,
    },

    card: {
        borderRadius: 20,
        paddingHorizontal: 18,
        paddingTop: 16,
        paddingBottom: 16,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.16,
        shadowRadius: 5,
        elevation: 5,
    },

    title: {
        textAlign: 'center',
        fontSize: 17,
        fontWeight: '500',
        color: '#222',
        marginBottom: 14,
    },

    mainPill: {
        height: 82,
        borderRadius: 999,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.14,
        shadowRadius: 4,
        elevation: 3,
    },

    mainIcon: {
        textShadowColor: 'rgba(0,0,0,0.25)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },

    subText: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 13,
        color: '#5d5a5d',
        fontWeight: '500',
    },

    bottomRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 14,
    },

    bottomBtn: {
        flex: 1,
        borderRadius: 999,
        paddingVertical: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.14,
        shadowRadius: 4,
        elevation: 4,
    },

    finishBtn: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#2b2328',
    },

    resetBtn: {
        backgroundColor: '#2b2328',
    },

    finishText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#111',
    },

    resetText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#fff',
    },
});