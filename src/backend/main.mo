actor {
  var visitorCount = 0;
  var pfpCount = 0;

  public shared ({ caller }) func registerVisit() : async () {
    visitorCount += 1;
  };

  public shared ({ caller }) func registerPfp() : async () {
    pfpCount += 1;
  };

  public query ({ caller }) func getVisitorCount() : async Nat {
    visitorCount;
  };

  public query ({ caller }) func getPfpCount() : async Nat {
    pfpCount;
  };
};
