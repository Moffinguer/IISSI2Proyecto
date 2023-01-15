import * as ExpoImagePicker from 'expo-image-picker'
import React, { useContext, useState } from 'react'
import { Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View, ScrollView } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { AuthorizationContext } from '../../context/AuthorizationContext'
import { Formik } from 'formik'
import * as yup from 'yup'
import { showMessage } from 'react-native-flash-message'
import { brandPrimary, brandPrimaryDisabled, brandPrimaryTap, brandSecondary, flashStyle, flashTextStyle } from '../../styles/GlobalStyles'
import maleAvatar from '../../../assets/maleAvatar.png'
import InputItem from '../../components/InputItem'
import TextRegular from '../../components/TextRegular'
import TextError from '../../components/TextError'

export default function RegisterScreen () {
  const { signUp } = useContext(AuthorizationContext)
  const [backendErrors, setBackendErrors] = useState()
  const initialUserValues = { firstName: '', lastName: '', email: '', password: '', phone: '', address: '', postalCode: '' }

  const validationSchema = yup.object().shape({
    firstName: yup
      .string()
      .max(30, 'First name too long')
      .required('First name is required'),
    lastName: yup
      .string()
      .max(50, 'Last name too long')
      .required('Last name is required'),
    email: yup
      .string()
      .email('Please enter a valid email')
      .required('Email Address is Required'),
    password: yup
      .string()
      .min(3, ({ min }) => `Password must be at least ${min} characters`)
      .required('Password is required'),
    phone: yup
      .string()
      .min(9, ({ min }) => `Phone must be at least ${min} characters`)
      .required('Phone is required'),
    address: yup
      .string()
      .max(75, 'Address too long')
      .required('Address is required'),
    postalCode: yup
      .string()
      .max(15, 'Postal code too long')
      .required('Postal code is required')
  })

  React.useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ExpoImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!')
        }
      }
    })()
  }, [])

  const pickImage = async (onSuccess) => {
    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    })
    if (!result.cancelled) {
      if (onSuccess) {
        onSuccess(result)
      }
    }
  }

  const register = (data) => {
    setBackendErrors([])
    signUp(data, () => showMessage({
      message: `Success. ${data.firstName}, welcome to DeliverUS! 😀`,
      type: 'success',
      style: flashStyle,
      titleStyle: flashTextStyle
    }),
    (error) => {
      setBackendErrors(error.errors)
    })
  }
  return (
        <Formik
          validationSchema={validationSchema}
          initialValues={initialUserValues}
          onSubmit={register}>
          {({ handleSubmit, setFieldValue, values, isValid }) => (
            <ScrollView>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={75}>
                <TouchableWithoutFeedback onPress={Platform.OS === 'ios' ? Keyboard.dismiss : undefined}>
                  <View style={{ alignItems: 'center' }}>
                    <View style={styles.container}>
                      <View style={{ flexDirection: 'row', marginTop: 30 }}>
                      <TouchableOpacity onPress={() =>
                        pickImage(
                          async result => {
                            await setFieldValue('file', result)
                          }
                        )
                      }>
                        <Image style={styles.image} source={values.file ? { uri: values.file.uri } : maleAvatar} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={values.file
                        ? async () => await setFieldValue('file', null)
                        : () =>
                            pickImage(
                              async result => {
                                await setFieldValue('file', result)
                              }
                            )
                      }>
                        <View style={{ paddingRight: 0, height: 30 }}>
                          {values.file
                            ? <MaterialCommunityIcons name='close' style={{ marginLeft: 0 }} size={30} />
                            : <MaterialCommunityIcons name='pencil' style={{ marginLeft: 0 }} size={30} />
                          }
                        </View>
                      </TouchableOpacity>
                      </View>
                      <InputItem
                        name='firstName'
                        label='First name'
                        textContentType='name'
                      />
                      <InputItem
                        name='lastName'
                        label='Last name'
                        textContentType='familyName'
                      />
                      <InputItem
                        name='email'
                        label='Email'
                        textContentType='emailAddress'
                        placeholder="customer@customer.com"
                      />
                      <InputItem
                        name='password'
                        label='Pass'
                        textContentType='password'
                        secureTextEntry={true}
                      />
                      <InputItem
                        name='phone'
                        label='Phone'
                        textContentType='telephoneNumber'
                      />
                      <InputItem
                        name='address'
                        label='Address'
                        textContentType='fullStreetAddress'
                      />
                      <InputItem
                        name='postalCode'
                        label='Postal Code'
                        textContentType='postalCode'
                      />
                      {backendErrors &&
                        backendErrors.map((error, index) => <TextError key={index}>{error.message}</TextError>)
                      }

                      <Pressable disabled={!isValid} onPress={handleSubmit}
                        style={({ pressed }) => [
                          {
                            backgroundColor: pressed
                              ? brandPrimaryTap
                              : brandPrimary
                          },
                          {
                            backgroundColor: !isValid
                              ? brandPrimaryDisabled
                              : brandPrimary
                          },
                          styles.button]}
                      >
                        <TextRegular textStyle={styles.text}>Sign up</TextRegular>
                      </Pressable>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </KeyboardAvoidingView>
            </ScrollView>
          )}
        </Formik>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '60%'
  },
  image: {
    width: 100,
    height: 100,
    borderColor: brandPrimary,
    borderWidth: 1,
    borderRadius: 50,
    marginTop: -20,
    alignSelf: 'center'
  },
  button: {
    borderRadius: 8,
    height: 40,
    margin: 12,
    padding: 10,
    width: '100%'
  },
  text: {
    fontSize: 16,
    color: brandSecondary,
    textAlign: 'center'
  }
})
