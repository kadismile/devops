//User documentation

/**
 * @swagger
 * resourcePath: /api
 * /api/v1/users/create:
 *   post:
 *     description: Api to create A user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: fullName
 *         description: Users Full name.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: email
 *         description: User's email.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: userType
 *         description: User's type.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: phoneNumber
 *         description: User's phone number.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: country
 *         description: User's Country.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: fullAdress
 *         description: User's fullAdress.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: fullAdress
 *         description: User's Address.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: countryCode
 *         description: User's countryCode e.g "NG".
 *         in: formData
 *         required: true
 *         type: string
 *       - name: longitude
 *         description: User's longitude.
 *         in: formData
 *         required: false
 *         type: string
 *       - name: latitude
 *         description: User's latitude.
 *         in: formData
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description:
 */

/**
 * @swagger
 * resourcePath: /api
 * /api/v1/users/login:
 *   post:
 *     description: Api to Login A user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email | phone
 *         description: User's email or phone number.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description:
 */