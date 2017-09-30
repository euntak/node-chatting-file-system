import crypto from 'crypto';

const config = {
    iterations: 91394,
    hashBytes: 64,
    digest: 'sha512'
};

export function passwordGenerator(password) {

    return new Promise((resolve, reject) => {
        const { iterations, hashBytes, digest } = config;

        crypto.randomBytes(64, (err, buf) => {
            const salt = buf.toString('base64');
            return crypto.pbkdf2(password, salt, iterations, hashBytes, digest, (err, key) => {

                if (err) return reject(err);

                resolve({
                    password: key.toString('base64'),
                    salt: salt
                });
            });
        });
    });

}

/**
 * origin : DB password
 * password : input password
 */
export function passwordComparison(user, password) {
    const origin = {
        salt: user.salt,
        originPassword: user.password
    }
    return new Promise((resolve, reject) => {
        const { iterations, hashBytes, digest } = config;
        const { salt, originPassword } = origin;

        return crypto.pbkdf2(password, salt, iterations, hashBytes, digest, (err, key) => {
            if (err) return reject(err);

            const inputPassword = key.toString('base64');
            if (inputPassword === originPassword) {
                resolve(user);
            } else {
                return reject();
            }
        });
    });

}