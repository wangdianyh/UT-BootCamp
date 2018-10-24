Attribute VB_Name = "YearChange"
Sub yearChange()
    Range("K1").Value = "year change"
    Range("L1").Value = "percent change"

    For I = 2 To Cells(Rows.Count, "I").End(xlUp).Row
        Dim yearStart As Double
        yearStart = Empty
        Dim yearEnd As Double
        yearEnd = Empty
        Dim dateStart As Long
        Dim dateEnd As Long
        Dim yearChange As Double

        For J = 2 To Cells(Rows.Count, "A").End(xlUp).Row

        ' For j = 2 To 1000
            If Cells(J, "A").Value = Cells(I, "I").Value Then
                If yearStart = Empty Then
                    yearStart = Cells(J, "C").Value
                    dateStart = Cells(J, "B").Value
                Else
                    If dateStart > Cells(J, "B").Value Then
                        dateStart = Cells(J, "B").Value
                        yearStart = Cells(J, "C").Value
                    End If
                End If
' find start
                If yearEnd = Empty Then
                    yearEnd = Cells(J, "F").Value
                    dateEnd = Cells(J, "B").Value
                Else
                    If dateEnd < Cells(J, "B").Value Then
                        dateEnd = Cells(J, "B").Value
                        yearEnd = Cells(J, "F").Value
                    End If
                End If
' find End
                       
            End If
        Next J
        
        yearChange = yearEnd - yearStart
        Cells(I, "K").Value = yearChange
        Cells(I, "L").Value = yearChange / yearStart
        If yearChange > 0 Then
            Cells(I, "K").Interior.Color = RGB(0, 255, 0)
        ElseIf yearChange < 0 Then
            Cells(I, "K").Interior.Color = RGB(255, 0, 0)
        End If
    Next I
    Range("L:L").NumberFormat = "0.00%"
End Sub
