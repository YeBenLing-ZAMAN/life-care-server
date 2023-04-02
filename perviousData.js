async function run() {
  try {
    await client.connect();
    const serviceCollection = client.db("doctor_bhai").collection("services");
    const bookingCollection = client.db("doctor_bhai").collection("booking");
    const usersCollection = client.db("doctor_bhai").collection("users");
    const doctorCollection = client.db("doctor_bhai").collection("doctors");
    const paymentCollection = client.db("doctor_bhai").collection("payments");

    const verifyAdmin = async (req, res, next) => {
      const adminRequester = req.decoded.email;
      const adminRequesterAccount = await usersCollection.findOne({
        email: adminRequester,
      });
      if (adminRequesterAccount.role === "admin") {
        next();
      } else {
        res.status(403).send({ message: "forbidden" });
      }
    };

    /***
     * API Naming Convestion
     * app.get('/booking') // get all bookings in this collection. get one more than by any filter
     * app.get('/booking/:id')// get a specific booking
     * app.post('/booking') // add a new booking
     * app.patch('/booking/:id') //one item update on your DB
     * app.put('/booking/:id') //upsert ==> update (if exists) or insert(if don't exits) // we are not sure data have or not
     * app.delete('/booking/:id') //one item delete on your DB
     */
    app.post("/create-payment-intent", async (req, res) => {
      const service = req.body;
      const price = service.price;
      const amount = price * 100;
      const paymentIntent = await stripePaymentMethod(amount, "usd", "card");
      if (paymentIntent) {
        res.send({
          clientSecret: paymentIntent.client_secret,
        });
      } else {
        res.send({
          message: "payment not complete",
        });
      }
    });

    app.get("/service", async (req, res) => {
      const query = {};
      const cursor = await serviceCollection.find(query).project({ name: 1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/booking", verifyJWT, async (req, res) => {
      const patient = req.query.patient;
      /*  const authorization = req.headers.authorization;
             console.log('auth header: ',authorization); */
      const decodedEmail = req.decoded.email;
      if (patient === decodedEmail) {
        const query = { patient: patient };
        const bookings = await bookingCollection.find(query).toArray();
        return res.send(bookings);
      } else {
        return res.status(403).send({ message: "forbidden access" });
      }
    });
    app.get("/booking/:id", verifyJWT, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const booking = await bookingCollection.findOne(query);
      res.send(booking);
    });

    app.get("/available", async (req, res) => {
      const date = req.query.date || "May 15, 2022";
      // step-01: GET ALL SERVICES
      const services = await serviceCollection.find().toArray();
      // res.send(services);

      //step-02: get the bookig of that day
      const query = { date: date };
      const bookings = await bookingCollection.find(query).toArray();
      // res.send(booking);

      // step-03: for each service, find bookings for that service
      services.forEach((service) => {
        const serviceBooking = bookings.filter(
          (b) => b.treatment === service.name
        );
        const booked = serviceBooking.map((s) => s.slot);
        // service.booked = booked; // for checking ;
        const available = service.slots.filter((s) => !booked.includes(s));
        // service.available = available;
        service.slots = available;
      });
      res.send(services);
    });

    app.get("/users", verifyJWT, async (req, res) => {
      const users = await usersCollection.find().toArray();
      res.send(users);
    });

    app.get("/admin/:email", async (req, res) => {
      const email = req.params.email;
      const user = await usersCollection.findOne({ email: email });
      const isAdmin = user.role === "admin";
      res.send({ admin: isAdmin });
    });

    app.put("/user/admin/:email", verifyJWT, verifyAdmin, async (req, res) => {
      const email = req.params.email;

      const filter = { email: email };
      const updateDoc = {
        $set: { role: "admin" },
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.post("/booking", async (req, res) => {
      const booking = req.body;
      // console.log(booking);
      const query = {
        treatment: booking.treatment,
        date: booking.date,
        patient: booking.patient,
      };
      const exists = await bookingCollection.findOne(query);
      if (exists) {
        return res.send({ success: false, booking: exists });
      }
      const result = await bookingCollection.insertOne(booking);
      // SendTestEmail(booking);
      return res.send({ success: true, result });
    });

    app.patch("/booking/:id", verifyJWT, async (req, res) => {
      const id = req.params.id;
      const payment = req.body;
      const filter = { _id: ObjectId(id) };
      //console.log(payment);
      const updateDoc = {
        $set: {
          paid: true,
          transactionId: payment.transactionId,
        },
      };

      /* send a email to client to send a confirmation mail */

      const result = await paymentCollection.insertOne(payment);
      const updatedBooking = await bookingCollection.updateOne(
        filter,
        updateDoc
      );
      res.send(updatedBooking);
    });

    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      // ekta inforation thake user body te
      const user = req.body;

      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      const token = jwt.sign(
        { email: email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      res.send({ result, token });
    });

    /* doctor route */
    app.get("/doctor", verifyJWT, verifyAdmin, async (req, res) => {
      const doctors = await doctorCollection.find().toArray();
      res.send(doctors);
    });

    app.post("/doctor", verifyJWT, async (req, res) => {
      const doctor = req.body;
      const result = await doctorCollection.insertOne(doctor);
      res.send(result);
    });

    app.delete("/doctor/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const result = await doctorCollection.deleteOne(filter);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
