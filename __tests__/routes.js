//DELETE FROM public.user WHERE user_id > 2;
  
  //                     .catch(err => {
                    //     console.log("OHNO!");
                    //     assert.fail("FAILURE OF ALL THAT MATTERS!");
                    // });
                    
                //This test behaves as expected:
                // request (server)
                // .post('/signup')
                // .send('dora', '123456')
                // .expect(201)
                // .then()
                    // .done()
                    // .then(function (res){
                    //     expect(res.body.name).toEqual('bob');
                    //     // done();
                    // })
                    // .then()
                    // .expect(201)
                    // .exepct(res.body.name).toEqual('bob');
                    // done()
                    // .catch(err => {
                    //     console.log("OHNO!");
                    //     // assert.fail("FAILURE OF ALL THAT MATTERS!");
                    // });
                    
                    // .then((res) => expect(20133))
                    // .expect(function (err, res) {
                    //     res.body.name.toEqual("bob");
                    //     done();
                    // })
                                    // const test = await request(server)
                //      .post('/signup')
                //      .send('dora', '123456')
                //     //.expect(404) //TODO: make 201 response in server
                //     .expect(6464)
                //     .then(function (res){
                //         assert.strictEqual(true, true);
                //     })
                //     .catch(err => {
                //         console.log("OHNO!");
                //         assert.fail("FAILURE OF ALL THAT MATTERS!");
                //     });
                    //console.log("am i the result of the send/post? ", test);

                    //we choose between the workaround.... (nothanks), or async test function description with "then" which allows for await and makes 
                    //if using "done", may not use async. async returns a promise object  in the function signature that jest detects
                    //if your test function is async, then jest will handle the "done()" aspect
                    //https://github.com/facebook/jest/issues/11404 stopped working in v27
                    //    Test functions cannot both take a 'done' callback and return something. Either use a 'done' callback, or return a promise.

                    // expect(function (err, res) {
                    //     res.body.name.should.equal("bob");
                    //     done();
                    // })
                    //.then(() => expect(201))
                    // .then((res) => {console.log("res.locals.newUser", res)} )
                    // .then((res) => expect((res.locals.newUser.name).toEqual('dora')))
                    //expect(test.body.name).toBeDefined();

    // describe('#hash', () => 
    //     it ('hashing should change a password', async () => {
    //         const password = '123456';
    //         const mockRequest = (sessionData, body) => ({
    //             session: { data: sessionData },
    //             body: { username: 'hashingMaster', password: password }
    //         });
    //         const mockResponse = {};
            
    //         // let mockNext;
    //         const hashedPwd = await controller.hash(mockRequest, mockResponse, () => {});
    //         console.log("hashedPw", hashedPwd);
    //         expect(hashedPwd).not.toBeInstanceOf(Error);
    //         expect(hashedPwd).not.toBe(password);
    //     })
    // );

    describe('#getUsers', () => {
        it('reads users', () => {
            const queryText = `
            INSERT INTO public.user (
                name,
                password)
            VALUES (dora, the map)
            RETURNING *
            ;`;
            db.query(queryText);
            const result = controller.getUsers();

        }