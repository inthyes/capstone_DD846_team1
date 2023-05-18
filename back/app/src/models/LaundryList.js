"use strict";
const db = require("../config/db");
const Review = require("./Review");

class LaundryList {
    constructor(body, deliveryAddress1, deliveryAddress2) {
        this.deliveryAddress1 = deliveryAddress1;
        this.deliveryAddress2 = deliveryAddress2;
    }

    async getLaundryInfo() {

        // const postNum = parseInt(this.deliveryAddress1);
        const nearPostNum = this.deliveryAddress1.slice(0, 3);

        return new Promise((resolve, reject) => {
          db.query("USE CAPSTONE", (err, result) => {
            const query = 
            "SELECT STORE.S_ID, STORE.S_ADDR2, STORE.S_NAME,STORE.S_COMMENT, LIKES.U_ID\
            FROM STORE\
            left outer JOIN likes ON STORE.S_ID = likes.S_ID\
            WHERE substr(S_ADDR1, 1, 3) = ?;";

            const getQuery = "SELECT S_ID FROM STORE WHERE substr(S_ADDR1, 1, 3) = ?;";

            if (err) reject(err);
            db.query(query, nearPostNum, (err, data) => {
              if (err) reject(err);
              else {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].U_ID != null) data[i].userLike = 1;
                    else data[i].userLike = 0;
                  }
                  db.query(getQuery, nearPostNum, async (err, result) => {
                    for (let i = 0; i < result.length; i++) {
                      const review = new Review(result[i].S_ID);
                      // console.log(result[i].S_ID)
                      const starAverage = await review.averageStar(result[i].S_ID);
                      if (!isNaN(starAverage)) {
                        data[i].starAverage = starAverage;
                      }
                    }
                    resolve(data);
                  })
              }
            });
          });
        });
      }

      // async searchLaundry() {
      //   const searchData = this.body;
      //   const value = searchData.search;
      //   return new Promise((resolve, reject) => {
      //     db.query("USE CAPSTONE", (err, result) => {
      //       const query = "SELECT * FROM STORE where S_ADDRESS LIKE '%" + value + "%';";
      //       //const query = "SELECT * FROM store_list;";
      //       //console.log(query);
      //       if (err) reject(err);
      //       db.query(query, [value], (err, data) => {
      //         if (err) reject(err);
      //         else {
      //           resolve(data);
      //         }
      //       });
      //     });
      //   });
      // }

    
}

module.exports = LaundryList;
