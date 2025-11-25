import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Modal,
    Clipboard,
    Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { useAppContext } from '../context/AppContext';

const ReceiveMoneyModal = ({ visible, onClose }) => {
    const { user } = useAppContext();
    const userId = user?.id || 'Not logged in';

    const copyToClipboard = async () => {
        try {
            await Clipboard.setString(userId);
            Alert.alert('Copied!', 'ID copied to clipboard');
        } catch (error) {
            Alert.alert('Error', 'Failed to copy');
        }
    };

    const shareId = async () => {
        try {
            await Share.share({ message: `My payment ID: ${userId}` });
        } catch (error) {
            Alert.alert('Error', 'Failed to share ID');
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={(e) => e.stopPropagation()}
                    style={styles.modalContent}
                >
                    <View style={styles.modalHeader}>
                        <Ionicons name="download" size={20} color="#00ea00ff" />
                        <Text style={styles.modalTitle}>Receive Money</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={20} color="#888" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.balanceText}>Balance: ${(user?.balance || 0).toFixed(2)}</Text>

                    <View style={styles.qrContainer}>
                        <QRCode
                            value={userId}
                            size={100}
                            color="black"
                            backgroundColor="white"
                        />
                    </View>

                    <View style={styles.idContainer}>
                        <Text style={styles.idLabel}>Your ID:</Text>
                        <Text style={styles.userId} numberOfLines={1}>{userId}</Text>
                    </View>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.actionButton} onPress={copyToClipboard}>
                            <Ionicons name="copy-outline" size={16} color="#1e1f1e" />
                            <Text style={styles.actionButtonText}>Copy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton} onPress={shareId}>
                            <Ionicons name="share-outline" size={16} color="#1e1f1e" />
                            <Text style={styles.actionButtonText}>Share</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.hint}>Share your ID or QR code to receive payments</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#2a2b2a',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    modalTitle: {
        fontSize: 18,
        color: '#ffffff',
        fontFamily: 'StackSansHeadline-SemiBold',
        flex: 1,
        marginLeft: 8,
    },
    balanceText: {
        fontSize: 14,
        color: '#00ea00ff',
        fontFamily: 'StackSansHeadline-Medium',
        marginBottom: 12,
        textAlign: 'center',
    },
    qrContainer: {
        backgroundColor: '#ffffff',
        padding: 10,
        borderRadius: 8,
        alignSelf: 'center',
        marginBottom: 12,
    },
    idContainer: {
        backgroundColor: '#1e1f1e',
        padding: 10,
        borderRadius: 8,
        marginBottom: 12,
    },
    idLabel: {
        fontSize: 12,
        color: '#888',
        fontFamily: 'StackSansHeadline-Regular',
        marginBottom: 4,
    },
    userId: {
        fontSize: 14,
        color: '#00ea00ff',
        fontFamily: 'StackSansHeadline-Bold',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 8,
    },
    actionButton: {
        backgroundColor: '#00ea00ff',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 4,
    },
    actionButtonText: {
        color: '#1e1f1e',
        fontSize: 14,
        fontFamily: 'StackSansHeadline-SemiBold',
        marginLeft: 6,
    },
    hint: {
        fontSize: 11,
        color: '#888',
        textAlign: 'center',
        fontFamily: 'StackSansHeadline-Regular',
    },
});

export default ReceiveMoneyModal;
