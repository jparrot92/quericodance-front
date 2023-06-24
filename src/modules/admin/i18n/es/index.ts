export default {
    admin: {
        label: {
            createUser: 'Crear usuario',
            editUser: 'Editar usuario',
            nif: 'NIF',
            name: 'Nombre',
            surname: 'Apellido',
            phone: 'Teléfono',
            photo: 'Foto',
            streetAddress: 'Dirección',
            num: 'Número',
            city: 'Ciudad',
            state: 'Estado',
            zipCode: 'Código postal',
            email: 'Correo electrónico',
            password: 'Contraseña',
            confirmation: 'Confirmación'
        },
        validations: {
            nifRequired: 'El NIF es requerido',
            nameRequired: 'El nombre es requerido',
            surnameRequired: 'El apellido es requerido',
            phoneRequired: 'El teléfono es requerido',
            photoRequired: 'La foto es requerida',
            streetAddressRequired: 'La dirección es requerida',
            numRequired: 'El número es requerido',
            cityRequired: 'La ciudad es requerida',
            stateRequired: 'El estado es requerido',
            zipCodeRequired: 'El código postal es requerido',
            emailRequired: 'El correo electrónico es requerido',
            passwordRequired: 'La contraseña es requerida'
        },
        notifications: {
            userCreateSuccessfully: 'Usuario creado con éxito',
            userUpdateSuccessfully: 'Usuario modificada con éxito',
            userDeleteSuccessfully: 'Usuario eliminado'
        },
        message: {
            userDelete: '¿Realmente desea eliminar este usuario?'
        }
    }
};
