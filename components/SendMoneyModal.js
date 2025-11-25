import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Modal,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

const SendMoneyModal = ({ visible, onClose, navigation }) => {
    const { user, sendMoney } = useAppContext();
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSend = async () => {
        if (!recipient.trim()) {
            Alert.alert('Error', 'Recipient ID is required');
            return;
        }
        if (!recipient.startsWith('user_')) {
            Alert.alert('Error', 'Invalid recipient ID format');
            return;
        }
        if (!amount.trim()) {
            Alert.alert('Error', 'Amount is required');
            return;
        }

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }
        if (numAmount > (user?.balance || 0)) {
            Alert.alert('Error', 'Insufficient balance');
            return;
        }

        setIsSending(true);
        try {
            const result = sendMoney(user?.id, recipient.trim(), numAmount, '');
            if (result.success) {
                Alert.alert('Success', `$${numAmount.toFixed(2)} sent!`);
                setRecipient('');
                setAmount('');
                onClose();
            } else {
                Alert.alert('Error', result.message);
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setIsSending(false);
        }
    };

    const quickAmounts = [10, 25, 50, 100];

    const handleClose = () => {
        setRecipient('');
        setAmount('');
        onClose();
    };

    const handleScanQR = () => {
        onClose();
        navigation?.navigate('ScanQRCode');
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleClose}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={handleClose}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={(e) => e.stopPropagation()}
                    style={styles.modalContent}
                >
                    <View style={styles.modalHeader}>
                        <Ionicons name="send" size={20} color="#00ea00ff" />
                        <Text style={styles.modalTitle}>Send Money</Text>
                        <TouchableOpacity onPress={handleClose}>
                            <Ionicons name="close" size={20} color="#888" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.balanceText}>Balance: ${(user?.balance || 0).toFixed(2)}</Text>

                    <View style={styles.recipientRow}>
                        <TextInput
                            style={styles.recipientInput}
                            placeholder="Recipient ID"
                            placeholderTextColor="#666"
                            value={recipient}
                            onChangeText={setRecipient}
                        />
                        <TouchableOpacity style={styles.scanButton} onPress={handleScanQR}>
                            <Ionicons name="qr-code-outline" size={20} color="#1e1f1e" />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="Amount"
                        placeholderTextColor="#666"
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="decimal-pad"
                    />

                    <View style={styles.quickAmounts}>
                        {quickAmounts.map((value) => (
                            <TouchableOpacity
                                key={value}
                                style={styles.quickButton}
                                onPress={() => setAmount(value.toString())}
                            >
                                <Text style={styles.quickText}>${value}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={[styles.sendButton, isSending && styles.sendButtonDisabled]}
                        onPress={handleSend}
                        disabled={isSending}
                    >
                        {isSending ? (
                            <ActivityIndicator color="#1e1f1e" size="small" />
                        ) : (
                            <Text style={styles.sendButtonText}>Send</Text>
                        )}
                    </TouchableOpacity>
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
    recipientRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    recipientInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#333333',
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#1e1f1e',
        fontSize: 14,
        color: '#cccccc',
        fontFamily: 'StackSansHeadline-Regular',
        marginRight: 8,
    },
    scanButton: {
        backgroundColor: '#00ea00ff',
        padding: 10,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        width: 42,
        height: 42,
    },
    input: {
        borderWidth: 1,
        borderColor: '#333333',
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#1e1f1e',
        fontSize: 14,
        color: '#cccccc',
        fontFamily: 'StackSansHeadline-Regular',
        marginBottom: 10,
    },
    quickAmounts: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    quickButton: {
        flex: 1,
        backgroundColor: '#333',
        paddingVertical: 8,
        marginHorizontal: 3,
        borderRadius: 6,
        alignItems: 'center',
    },
    quickText: {
        color: '#cccccc',
        fontSize: 12,
        fontFamily: 'StackSansHeadline-Medium',
    },
    sendButton: {
        backgroundColor: '#00ea00ff',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#666',
    },
    sendButtonText: {
        color: '#1e1f1e',
        fontSize: 16,
        fontFamily: 'StackSansHeadline-SemiBold',
    },
});

export default SendMoneyModal;
