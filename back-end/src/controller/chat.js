import Chat from '../model/chat';

export const getChattingLog = (req, res, next) => {
    const skip = parseInt(req.params.skip, 10);
    const limit = parseInt(req.params.limit, 10);

    Chat.getChattingLogBySkipLimit(skip, limit)
    .then( data => {
        if(data.length > 0) {
            return res.status(200).json({
                chatLog : data,
                code : 1,
            });
        }
        else throw new Error('EMPTY List !');
    })
    .catch( err => {
        return res.status(401).json({
            chatLog : null,
            code : 0,
        });
    });
}