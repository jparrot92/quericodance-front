export default {
    admin: {
        label: {
            nif: 'NIF',
            name: 'Name',
            surname: 'Surname',
            phone: 'Phone',
            photo: 'Photo',
            streetAddress: 'Street address',
            num: 'Num',
            city: 'City',
            state: 'State',
            zipCode: 'Zip code',
            email: 'Email',
            password: 'Password',
            confirmation: 'Confirmation'
        },
        validations: {
            nifRequired: 'NIF is required',
            nameRequired: 'Name is required',
            surnameRequired: 'Surname is required',
            phoneRequired: 'Phone is required',
            photoRequired: 'Photo is required',
            streetAddressRequired: 'Street address is required',
            numRequired: 'Num is required',
            cityRequired: 'City is required',
            stateRequired: 'State is required',
            zipCodeRequired: 'Zip code is required',
            emailRequired: 'Email is required',
            passwordRequired: 'Password is required'
        },
        notifications: {
            userCreateSuccessfully: 'User created successfully',
            userUpdateSuccessfully: 'User modified successfully',
            userDeleteSuccessfully: 'User deleted'
        },
        message: {
            userDelete: 'Do you really want to delete this user?'
        }
    }
};
