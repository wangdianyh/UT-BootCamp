Attribute VB_Name = "SummariseData"
Sub summariseData()
    Range("N2").Value = "Greatest % Increase"
    Range("N3").Value = "Greatest % Decrease"
    Range("N4").Value = "Greatest Total Volume"
    
    Range("O1").Value = "Ticker"
    Range("P1").Value = "Value"
    
    Dim increase As Range
    Dim decrease As Range
    Dim volume As Range
    
    Dim r As Range
    Range(Cells(2, "P"), Cells(3, "P")).NumberFormat = "0.00%"
    For Each r In Range(Cells(2, "L"), Cells(Rows.Count, "L"))
        If increase Is Nothing Then
            Set increase = r
        Else
            If increase.Value < r.Value Then
                Set increase = r
            End If
        End If
        ' get greatest increase cell
        If decrease Is Nothing Then
            Set decrease = r
        Else
            If decrease.Value > r.Value Then
                Set decrease = r
            End If
        End If
        ' get greatest decrease cell
        If volume Is Nothing Then
            Set volume = Cells(r.Row, "J")
        Else
            If volume.Value < Cells(r.Row, "J").Value Then
                Set volume = Cells(r.Row, "J")
            End If
        End If
        ' get greast volume
    Next r
    
    Range("O2").Value = Cells(increase.Row, "I").Value
    Range("P2").Value = Cells(increase.Row, "L").Value
    Range("O3").Value = Cells(decrease.Row, "I").Value
    Range("P3").Value = Cells(decrease.Row, "L").Value
    Range("O4").Value = Cells(volume.Row, "I").Value
    Range("P4").Value = Cells(volume.Row, "J").Value
   
End Sub
