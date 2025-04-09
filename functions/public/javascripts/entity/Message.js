class Message{
    // Punya Orang
    constructor(id, consultationId, senderId, content, fileUrl, timestamp) {
        this.id = id;
        this.consultationId = consultationId;
        this.senderId = senderId;
        this.content = content;
        this.fileUrl = fileUrl;
        this.timestamp = timestamp || new Date();
    }

    toObject() {
        return {
            id: this.id,
            consultationId: this.consultationId,
            senderId: this.senderId,
            content: this.content,
            fileUrl: this.fileUrl,
            timestamp: this.timestamp,
        };
    }
}

module.exports = Message;